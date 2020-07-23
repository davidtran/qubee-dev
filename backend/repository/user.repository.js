const User = require('../database/schemas/user.schema');

async function finallAll() {
  return User.find();
}

async function findUserByEmail(email, polulation = false) {
  const q = User.findOne({ email });
  if (!polulation) {
    return q;
  }
  return q.populate('role_id', ['permissions', 'type', 'is_archive', 'is_secured']);
}

async function findUserById(id, polulation = false) {
  const q = User.findById(id, ['id', 'name', 'email']);
  if (!polulation) {
    return q;
  }
  return q.populate('role_id', ['permissions', 'type', 'is_archive']);
}

async function createNewUser(user) {
  return User.create(user);
}

module.exports = { findUserByEmail, findUserById, createNewUser, finallAll };
