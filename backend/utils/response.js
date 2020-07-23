function raiseException(response, statusCode, message, error) {
  const exceptionBody = {
    message,
    status: statusCode
  }
  if (error) {
    exceptionBody.errors = error;
  }
  return response.status(statusCode).json(exceptionBody);
}

module.exports = { raiseException };
