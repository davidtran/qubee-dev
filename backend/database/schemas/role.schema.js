const mongoose = require('mongoose');
const { ROLES } = require('../../constants/role.constant');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  type: { type: String, enum: ROLES, required: true },
  permissions: { type: [String], default: [], required: true },
  is_archive: { type: Boolean, required: true, default: false },
  is_secured: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Role', roleSchema);
