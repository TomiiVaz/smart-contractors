import { ethers } from "hardhat";

async function main() {
  console.log("🔧 Configurando USDC para el backend...");
  
  // Direcciones de los contratos
  const USDC_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const WORKESCROW_ADDRESS = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
  
  // Backend wallet (Account #0)
  const backendWallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    ethers.provider
  );
  
  console.log(`🔑 Backend wallet: ${backendWallet.address}`);
  
  // Conectar a los contratos
  const usdcContract = await ethers.getContractAt("MockERC20", USDC_ADDRESS);
  const workEscrowContract = await ethers.getContractAt("WorkEscrow", WORKESCROW_ADDRESS);
  
  // 1. Verificar balance actual
  const currentBalance = await usdcContract.balanceOf(backendWallet.address);
  console.log(`💰 Balance actual: ${ethers.formatUnits(currentBalance, 6)} USDC`);
  
  // 2. Si no tiene suficiente, mintear USDC
  if (currentBalance < ethers.parseUnits("1000", 6)) {
    console.log("🪙 Minteando 1000 USDC para el backend...");
    const mintTx = await usdcContract.mint(backendWallet.address, ethers.parseUnits("1000", 6));
    await mintTx.wait();
    console.log("✅ USDC minteado exitosamente");
  }
  
  // 3. Verificar nuevo balance
  const newBalance = await usdcContract.balanceOf(backendWallet.address);
  console.log(`💰 Nuevo balance: ${ethers.formatUnits(newBalance, 6)} USDC`);
  
  // 4. Aprobar al contrato WorkEscrow para gastar USDC
  console.log("✅ Aprobando WorkEscrow para gastar USDC...");
  const approveTx = await usdcContract.connect(backendWallet).approve(
    WORKESCROW_ADDRESS,
    ethers.parseUnits("1000", 6) // Aprobar hasta 1000 USDC
  );
  await approveTx.wait();
  console.log("✅ Aprobación exitosa");
  
  // 5. Verificar allowance
  const allowance = await usdcContract.allowance(backendWallet.address, WORKESCROW_ADDRESS);
  console.log(`✅ Allowance: ${ethers.formatUnits(allowance, 6)} USDC`);
  
  console.log("🎉 Backend configurado correctamente para crear trabajos!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
