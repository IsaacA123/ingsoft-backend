class UserDTO {
    constructor(email, password) {
      if (!email || typeof email !== 'string') {
        throw new Error("Invalid 'email': It must be a non-empty string.");
      }
      if (!password || typeof password !== 'string') {
        throw new Error("Invalid 'password': It must be a non-empty string.");
      }
  
      this.email = email;
      this.password = password;
    }
  
    toSafeObject() {
      return {
        email: this.email,
      };
    }
  }
  
module.exports = UserDTO;
  