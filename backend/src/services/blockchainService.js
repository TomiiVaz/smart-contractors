const axios = require('axios');

class BlockchainService {
  constructor() {
    this.apiUrl = process.env.BLOCKCHAIN_API_URL || 'http://localhost:3001';
    this.isConnected = false;
  }

  async initialize() {
    try {
      // Verificar que la API de blockchain esté disponible
      const response = await axios.get(`${this.apiUrl}/health`);
      
      if (response.data.success) {
        this.isConnected = true;
        console.log('✅ Blockchain service conectado a API raíz');
        console.log(`📍 API URL: ${this.apiUrl}`);
      } else {
        throw new Error('API de blockchain no responde correctamente');
      }

    } catch (error) {
      console.error('❌ Error conectando con API de blockchain:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  // Verificar disponibilidad de blockchain
  checkAvailability() {
    if (!this.isConnected) {
      throw new Error('Blockchain API no está disponible. No se pueden ejecutar operaciones que requieren blockchain.');
    }
  }

  // Crear un nuevo trabajo
  async createWork(clientAddress, workerAddress, amount, title, description, deadline) {
    try {
      this.checkAvailability();

      const response = await axios.post(`${this.apiUrl}/works`, {
        client: clientAddress,    // Cliente que paga
        worker: workerAddress,    // Trabajador asignado
        amount: amount.toString(),
        title,
        description,
        deadline: deadline.toString()
      });

      return response.data.data;

    } catch (error) {
      console.error('Error creando trabajo:', error);
      throw error;
    }
  }

  // Aceptar un trabajo
  async acceptWork(workId) {
    try {
      this.checkAvailability();

      const response = await axios.post(`${this.apiUrl}/works/${workId}/accept`);
      return response.data.data;

    } catch (error) {
      console.error('Error aceptando trabajo:', error);
      throw error;
    }
  }

  // Entregar trabajo
  async submitWork(workId, deliveryData) {
    try {
      this.checkAvailability();

      const response = await axios.post(`${this.apiUrl}/works/${workId}/submit`, {
        deliveryData
      });
      return response.data.data;

    } catch (error) {
      console.error('Error entregando trabajo:', error);
      throw error;
    }
  }

  // Aprobar trabajo
  async approveWork(workId) {
    try {
      this.checkAvailability();

      const response = await axios.post(`${this.apiUrl}/works/${workId}/approve`);
      return response.data.data;

    } catch (error) {
      console.error('Error aprobando trabajo:', error);
      throw error;
    }
  }

  // Cancelar trabajo
  async cancelWork(workId) {
    try {
      this.checkAvailability();

      const response = await axios.post(`${this.apiUrl}/works/${workId}/cancel`);
      return response.data.data;

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

      const response = await axios.get(`${this.apiUrl}/works/${workId}`);
      return response.data.data;

    } catch (error) {
      console.error('Error obteniendo trabajo:', error);
      throw error;
    }
  }

  // Obtener balance de USDC
  async getUSDCBalance(address) {
    try {
      this.checkAvailability();

      const response = await axios.get(`${this.apiUrl}/users/balance/${address}`);
      return response.data.data.balance;

    } catch (error) {
      console.error('Error obteniendo balance USDC:', error);
      throw error;
    }
  }

  // Aprobar gasto de USDC
  async approveUSDC(spenderAddress, amount) {
    try {
      this.checkAvailability();

      const response = await axios.post(`${this.apiUrl}/users/approve`, {
        spender: spenderAddress,
        amount: amount.toString()
      });
      return response.data.data;

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

      const response = await axios.get(`${this.apiUrl}/health/detailed`);
      
      return {
        connected: response.data.success,
        apiUrl: this.apiUrl,
        status: response.data.status,
        services: response.data.services
      };

    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

module.exports = new BlockchainService();