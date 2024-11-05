const responseHandler = (res, statusCode, code, message, data = message) => {
    const response = {
      status: statusCode,
      code: code,
      message: message,
      data: data,
    };
  
    return res.status(statusCode).json(response);
  };
  
module.exports = responseHandler;
