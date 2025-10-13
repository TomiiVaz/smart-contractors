const { ethers } = require('ethers');

class BlockchainService {
  constructor() {
    this.rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
    this.workEscrowAddress = process.env.WORKESCROW_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    this.usdcAddress = process.env.USDC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    this.provider = null;
    this.workEscrowContract = null;
    this.usdcContract = null;
    this.isConnected = false;
  }

  async initialize() {
    try {
      // Conectar al nodo Hardhat
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
      
      // Verificar conexión
      const network = await this.provider.getNetwork();
      console.log(`✅ Conectado a red: ${network.name} (Chain ID: ${network.chainId})`);
      
      // Crear instancias de contratos
      this.workEscrowContract = new ethers.Contract(
        this.workEscrowAddress,
        this.getWorkEscrowABI(),
        this.provider
      );
      
      this.usdcContract = new ethers.Contract(
        this.usdcAddress,
        this.getUSDCABI(),
        this.provider
      );
      
      this.isConnected = true;
      console.log('✅ Blockchain service conectado a Hardhat');
      console.log(`📍 WorkEscrow: ${this.workEscrowAddress}`);
      console.log(`📍 USDC: ${this.usdcAddress}`);

    } catch (error) {
      console.error('❌ Error conectando con Hardhat:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  // Verificar disponibilidad de blockchain
  checkAvailability() {
    if (!this.isConnected) {
      throw new Error('Blockchain no está disponible. No se pueden ejecutar operaciones que requieren blockchain.');
    }
  }

  // Obtener ABI de WorkEscrow
  getWorkEscrowABI() {
    return [
      "function createWork(address _worker, uint256 _amount, string calldata _title, string calldata _description, uint256 _deadline) external returns (uint256)",
      "function acceptWork(uint256 _workId) external",
      "function submitWork(uint256 _workId, string calldata _deliveryData) external",
      "function approveWork(uint256 _workId) external",
      "function cancelWork(uint256 _workId) external",
      "function getWork(uint256 _workId) external view returns (tuple(uint256 id, address client, address worker, uint256 amount, string title, string description, uint8 status, uint256 createdAt, uint256 deadline, string deliveryData))",
      "function getNextWorkId() external view returns (uint256)",
      "function usdcToken() external view returns (address)",
      "function owner() external view returns (address)",
      "function paused() external view returns (bool)",
      "event WorkCreated(uint256 indexed workId, address indexed client, address indexed worker, uint256 amount, string title)",
      "event WorkAccepted(uint256 indexed workId, address indexed worker)",
      "event WorkSubmitted(uint256 indexed workId, string deliveryData)",
      "event WorkApproved(uint256 indexed workId, address indexed client, address indexed worker, uint256 amount)",
      "event WorkCancelled(uint256 indexed workId, address indexed client)"
    ];
  }

  // Obtener ABI de USDC (MockERC20)
  getUSDCABI() {
    return [
      "function balanceOf(address account) external view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function transfer(address to, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
      "function mint(address to, uint256 amount) external",
      "function decimals() external view returns (uint8)",
      "function name() external view returns (string)",
      "function symbol() external view returns (string)"
    ];
  }

  // Crear un nuevo trabajo
  async createWork(clientAddress, workerAddress, amount, title, description, deadline) {
    try {
      this.checkAvailability();

      // Convertir amount a wei (6 decimales para USDC)
      const amountInWei = ethers.parseUnits(amount.toString(), 6);
      
      // Crear transacción
      const tx = await this.workEscrowContract.createWork(
        workerAddress,
        amountInWei,
        title,
        description,
        deadline
      );

      // Esperar confirmación
      const receipt = await tx.wait();
      
      // Obtener el ID del trabajo del evento
      const workCreatedEvent = receipt.logs.find(log => {
        try {
          const parsed = this.workEscrowContract.interface.parseLog(log);
          return parsed?.name === 'WorkCreated';
        } catch {
          return false;
        }
      });

      if (!workCreatedEvent) {
        throw new Error('WorkCreated event not found');
      }

      const parsedEvent = this.workEscrowContract.interface.parseLog(workCreatedEvent);
      const workId = parsedEvent.args.workId;

      return {
        workId: workId.toString(),
        transactionHash: receipt.hash
      };

    } catch (error) {
      console.error('Error creando trabajo:', error);
      throw error;
    }
  }

  // Aceptar un trabajo
  async acceptWork(workId) {
    try {
      this.checkAvailability();

      const tx = await this.workEscrowContract.acceptWork(workId);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.hash
      };

    } catch (error) {
      console.error('Error aceptando trabajo:', error);
      throw error;
    }
  }

  // Entregar trabajo
  async submitWork(workId, deliveryData) {
    try {
      this.checkAvailability();

      const tx = await this.workEscrowContract.submitWork(workId, deliveryData);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.hash
      };

    } catch (error) {
      console.error('Error entregando trabajo:', error);
      throw error;
    }
  }

  // Aprobar trabajo
  async approveWork(workId) {
    try {
      this.checkAvailability();

      const tx = await this.workEscrowContract.approveWork(workId);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.hash
      };

    } catch (error) {
      console.error('Error aprobando trabajo:', error);
      throw error;
    }
  }

  // Cancelar trabajo
  async cancelWork(workId) {
    try {
      this.checkAvailability();

      const tx = await this.workEscrowContract.cancelWork(workId);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.hash
      };

    } catch (error) {
      console.error('Error cancelando trabajo:', error);
      throw error;
    }
  }

  // Obtener detalles de un trabajo
  async getWork(workId) {
    try {
      if (!this.isConnected) {
        throw new Error('Blockchain service no está conectado');
      }

      const work = await this.workEscrowContract.getWork(workId);
      return {
        id: work.id.toString(),
        client: work.client,
        worker: work.worker,
        amount: ethers.formatUnits(work.amount, 6),
        title: work.title,
        description: work.description,
        status: work.status,
        createdAt: work.createdAt.toString(),
        deadline: work.deadline.toString(),
        deliveryData: work.deliveryData
      };

    } catch (error) {
      console.error('Error obteniendo trabajo:', error);
      throw error;
    }
  }

  // Obtener balance de USDC
  async getUSDCBalance(address) {
    try {
      this.checkAvailability();

      const balance = await this.usdcContract.balanceOf(address);
      return ethers.formatUnits(balance, 6);

    } catch (error) {
      console.error('Error obteniendo balance USDC:', error);
      throw error;
    }
  }

  // Aprobar gasto de USDC
  async approveUSDC(spenderAddress, amount) {
    try {
      this.checkAvailability();

      const amountInWei = ethers.parseUnits(amount.toString(), 6);
      const tx = await this.usdcContract.approve(spenderAddress, amountInWei);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.hash
      };

    } catch (error) {
      console.error('Error aprobando USDC:', error);
      throw error;
    }
  }

  // Verificar conexión con blockchain
  async checkConnection() {
    try {
      if (!this.isConnected) {
        return { connected: false, error: 'Service not initialized' };
      }

      // Verificar que podemos hacer una llamada al contrato
      const nextWorkId = await this.workEscrowContract.getNextWorkId();
      const owner = await this.workEscrowContract.owner();
      const paused = await this.workEscrowContract.paused();
      
      return {
        connected: true,
        rpcUrl: this.rpcUrl,
        workEscrowAddress: this.workEscrowAddress,
        usdcAddress: this.usdcAddress,
        nextWorkId: nextWorkId.toString(),
        owner: owner,
        paused: paused,
        status: 'healthy'
      };

    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

module.exports = new BlockchainService();