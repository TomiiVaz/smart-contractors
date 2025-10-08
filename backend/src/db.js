const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database(':memory:'); // Si queremos usar la base de datos en memoria para pruebas rápidas
const db = new sqlite3.Database('./data/database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      wallet_address TEXT UNIQUE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS work_status (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS works (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      worker_id INTEGER,
      client_address TEXT NOT NULL,
      worker_address TEXT,
      amount INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      deadline INTEGER NOT NULL,
      delivery_data TEXT,
      blockchain_work_id TEXT,
      transaction_hash TEXT,
      FOREIGN KEY (client_id) REFERENCES users(id),
      FOREIGN KEY (worker_id) REFERENCES users(id),
      FOREIGN KEY (status_id) REFERENCES work_status(id)
    );
  `);


  // Insertar usuarios con direcciones de wallet
  db.run(`
    INSERT OR IGNORE INTO users (id, name, email, password, wallet_address) VALUES
    (1, 'Alice', 'alice@mail.com', 'hashed_pass3', '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'),
    (2, 'Bob', 'bob@mail.com', 'hashed_pass4', '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'),
    (3, 'Charlie', 'charlie@mail.com', 'hashed_pass5', '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db'),
    (4, 'Diana', 'diana@mail.com', 'hashed_pass6', '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabAb');
  `); 

  // Insertar estados de trabajo
  db.run(`
    INSERT OR IGNORE INTO work_status (id, name) VALUES
    (0, 'Created'),
    (1, 'InProgress'),
    (2, 'Submitted'),
    (3, 'Completed'),
    (4, 'Cancelled');
  `);

  // Insertar trabajos de prueba con diferentes estados
  db.run(`
    INSERT OR IGNORE INTO works (
      id, client_id, worker_id, client_address, worker_address, amount, title, description, 
      status_id, created_at, deadline, delivery_data, blockchain_work_id, transaction_hash
    ) VALUES 
    -- Trabajo 1: Creado (Created)
    (1, 1, NULL, '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 
     100000, 'Desarrollar sitio web', 'Sitio web con React y TypeScript', 0, 
     strftime('%s','now'), strftime('%s','now','+7 days'), NULL, '1', '0xabc123...'),
    
    -- Trabajo 2: En Progreso (InProgress)
    (2, 2, 3, '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', 
     50000, 'Diseñar logo', 'Logo moderno para startup', 1, 
     strftime('%s','now','-2 days'), strftime('%s','now','+5 days'), NULL, '2', '0xdef456...'),
    
    -- Trabajo 3: Entregado (Submitted)
    (3, 3, 4, '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabAb', 
     75000, 'Escribir artículos', '10 artículos sobre blockchain', 2, 
     strftime('%s','now','-5 days'), strftime('%s','now','+2 days'), 'https://mi-blog.com/articulos', '3', '0xghi789...'),
    
    -- Trabajo 4: Completado (Completed)
    (4, 4, 1, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabAb', '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', 
     200000, 'App móvil', 'App iOS para gestión de tareas', 3, 
     strftime('%s','now','-10 days'), strftime('%s','now','-3 days'), 'https://github.com/usuario/app-movil', '4', '0xjkl012...'),
    
    -- Trabajo 5: Cancelado (Cancelled)
    (5, 1, NULL, '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', NULL, 
     30000, 'Traducir documento', 'Traducción de 10 páginas de inglés a español', 4, 
     strftime('%s','now','-3 days'), strftime('%s','now','+4 days'), NULL, '5', '0xmno345...');
  `);

});

module.exports = db;
