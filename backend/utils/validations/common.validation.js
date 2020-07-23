function rawValidateMessage(errors) {
  return errors.map(error => error.message);
}

module.exports = { rawValidateMessage };
