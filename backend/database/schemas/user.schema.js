const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: { type: String, required: true },
  role_id: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Role' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_archive: { type: Boolean, required: true, default: false }
}, {
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', userSchema);
