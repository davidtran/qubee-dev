const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  file_name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  folder: { type: Schema.Types.ObjectId, required: false, ref: 'Folder' },
  type: { type: String, required: true },
  restricted: { type: Boolean, required: true, default: false },
  size: { type: Number, required: true },
  tags: { type: [String], required: true, default: []}
}, {
  collection: 'files',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

fileSchema.index({ file_name: 'text', tags: 'text' });

module.exports = mongoose.model('File', fileSchema);
