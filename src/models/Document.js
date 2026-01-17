import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: String,
  clientName: String,
  status: { type: String, default: 'pending' }, // 'pending' or 'signed'
  signatureData: String, // Base64 Image string
  signedAt: Date,        // Legal Timestamp
  ipAddress: String,     // Legal Audit Trail
}, { timestamps: true });

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);