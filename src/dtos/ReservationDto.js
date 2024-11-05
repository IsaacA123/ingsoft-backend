class ReservationDTO {
    constructor(reservation_date, start_time, end_time, laptop_id) {
      this.reservation_date = reservation_date;
      this.start_time = start_time;
      this.end_time = end_time;
      this.laptop_id = laptop_id;
    }
  }
  
  module.exports = ReservationDTO;
  