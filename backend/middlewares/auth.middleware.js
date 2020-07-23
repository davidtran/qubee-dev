const { verify } = require('../helpers/jwt.helper');
const { findUserByEmail } = require('../repository/user.repository');
const { raiseException } = require('../utils/response');

const adminAuthenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return raiseException(res, 401, "Authentication fails");
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return raiseException(res, 401, "Authentication fails");
    }
    const { user } = verify(token);
    if (!user || !user.email) {
      return raiseException(res, 401, "Authentication fails");
    }
    const userData = await findUserByEmail(user.email, true);
    if (!userData || !userData.email) {
      return raiseException(res, 401, "Authentication fails");
    }
    userData.role = userData.role_id;
    userData.role_id = null;
    req.user = userData;
    next();
  } catch (error) {
    return raiseException(res, 401, "Authentication fails");
  }
};

module.exports = { adminAuthenticationMiddleware };