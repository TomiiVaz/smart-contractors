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

// Actualizar dirección de wallet
const updateWalletAddress = (userId, walletAddress, callback) => {
  db.run(
    "UPDATE users SET wallet_address = ? WHERE id = ?",
    [walletAddress, userId],
    function (err) {
      if (err) return callback(err);
      if (this.changes === 0) {
        return callback(new Error('Usuario no encontrado'));
      }
      callback(null, { success: true, message: 'Wallet address actualizada' });
    }
  );
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

module.exports = {
  getAllUsers,
  createUser,
  findByEmail,
  updateWalletAddress,
  findById
};
