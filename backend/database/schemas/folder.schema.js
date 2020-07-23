const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  folder: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Folder' },
  restricted: { type: Boolean, required: true, default: false },
  tags: { type: [String], required: true, default: []}
}, {
  collection: 'folders',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

folderSchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Folder', folderSchema);
