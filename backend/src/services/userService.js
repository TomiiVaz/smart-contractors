const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

// Listar todos los usuarios
const listUsers = (callback) => {
  userRepository.getAllUsers((err, users) => {
    if (err) return callback(err);
    callback(null, users);
  });
};

// Registrar un usuario nuevo
const addUser = (name, email, password, wallet_address, callback) => {
  if (!name || !email || !password) {
    return callback(new Error("Name, email y password son requeridos"));
  }

  const user = { name, email, password, wallet_address };
  userRepository.createUser(user, callback);
};

// Login y generación de token
const login = (email, password, callback) => {
  userRepository.findByEmail(email, (err, user) => {
    if (err) return callback(err);
    if (!user) return callback(new Error("Usuario no encontrado"));

    if (user.password !== password) {
      return callback(new Error("Credenciales inválidas"));
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'mi_secreto_super_seguro',
      { expiresIn: '2h' }
    );

    callback(null, { user, token });
  });
};


// Obtener usuario por ID
const getUserById = (userId, callback) => {
  if (!userId) {
    return callback(new Error("User ID es requerido"));
  }

  userRepository.findById(userId, callback);
};

// Obtener usuario por email
const getUserByEmail = (email, callback) => {
  if (!email) {
    return callback(new Error("Email es requerido"));
  }

  userRepository.findByEmail(email, callback);
};

// Obtener usuario por wallet address
const getUserByWalletAddress = (walletAddress, callback) => {
  if (!walletAddress) {
    return callback(new Error("Wallet address es requerido"));
  }

  userRepository.findByWalletAddress(walletAddress, callback);
};

module.exports = {
  listUsers,
  addUser,
  login,
  getUserById,
  getUserByEmail,
  getUserByWalletAddress
};
