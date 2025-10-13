const db = require('../db');
const User = require('../model/user');

// Obtener todos los usuarios
const getAllUsers = (callback) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return callback(err);
    const users = rows.map(row => new User(row.id, row.name, row.email, row.password, row.wallet_address));
    callback(null, users);
  });
};

// Crear usuario
const createUser = (user, callback) => {
  db.run(
    "INSERT INTO users (name, email, password, wallet_address) VALUES (?, ?, ?, ?)",
    [user.name, user.email, user.password, user.wallet_address || null],
    function (err) {
      if (err) return callback(err);
      callback(null, new User(this.lastID, user.name, user.email, user.password, user.wallet_address));
    }
  );
};

// Buscar usuario por email (más típico para login)
const findByEmail = (email, callback) => {
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    const user = new User(row.id, row.name, row.email, row.password, row.wallet_address);
    callback(null, user);
  });
};


// Buscar usuario por ID
const findById = (id, callback) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    const user = new User(row.id, row.name, row.email, row.password, row.wallet_address);
    callback(null, user);
  });
};

// Buscar usuario por wallet address
const findByWalletAddress = (walletAddress, callback) => {
  db.get("SELECT * FROM users WHERE wallet_address = ?", [walletAddress], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    const user = new User(row.id, row.name, row.email, row.password, row.wallet_address);
    callback(null, user);
  });
};

module.exports = {
  getAllUsers,
  createUser,
  findByEmail,
  findById,
  findByWalletAddress
};
