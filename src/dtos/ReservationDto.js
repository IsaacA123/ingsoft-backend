class ReservationDTO {
    constructor(reservation_date, start_time, end_time, reserved_by_user_id, laptop_id) {
      this.reservation_date = reservation_date;
      this.start_time = start_time;
      this.end_time = end_time;
      this.reserved_by_user_id = reserved_by_user_id;
      this.laptop_id = laptop_id;
    }
  }
  
  module.exports = ReservationDTO;
  