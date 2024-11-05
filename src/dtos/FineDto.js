class FineDTO {
    constructor(name, description, end_date, user_id) {
      this.name = name;
      this.description = description || null; 
      this.end_date = end_date;
      this.user_id = user_id;
    }
  }
  
  module.exports = FineDTO;
  