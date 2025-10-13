import { ethers } from "hardhat";

async function main() {
  console.log("👥 Registrando workers en la base de datos...");
  
  // Workers de Hardhat (Account #1, #2, #3)
  const workers = [
    {
      name: "Bob",
      email: "bob@mail.com", 
      password: "hashed_pass4",
      wallet_address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    },
    {
      name: "Charlie", 
      email: "charlie@mail.com",
      password: "hashed_pass5",
      wallet_address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    },
    {
      name: "Diana",
      email: "diana@mail.com", 
      password: "hashed_pass6",
      wallet_address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
    }
  ];
  
  console.log("📝 Workers a registrar:");
  workers.forEach((worker, index) => {
    console.log(`  ${index + 1}. ${worker.name} (${worker.email}) - ${worker.wallet_address}`);
  });
  
  console.log("\n💡 Para registrar estos workers, ejecuta estos comandos SQL en la base de datos:");
  console.log("INSERT INTO users (name, email, password, wallet_address) VALUES");
  
  workers.forEach((worker, index) => {
    const comma = index < workers.length - 1 ? "," : ";";
    console.log(`  ('${worker.name}', '${worker.email}', '${worker.password}', '${worker.wallet_address}')${comma}`);
  });
  
  console.log("\n🎯 O usa el endpoint POST /users/register para cada worker");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
