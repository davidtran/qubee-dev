const Role = require('../database/schemas/role.schema');

async function findRoleByType(type, fields) {
  return Role.findOne({ type }, fields);
}

module.exports = { findRoleByType };
