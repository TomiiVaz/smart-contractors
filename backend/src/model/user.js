class User {
  constructor(id, name, email, password, wallet_address = null) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.wallet_address = wallet_address;
  }
}

module.exports = User;