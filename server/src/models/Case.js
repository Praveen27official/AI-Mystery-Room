import mongoose from 'mongoose';
const { Schema } = mongoose;

const CaseSchema = new Schema({
  title: String, premise: String, story: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  suspects: [{ _id: false, id: String, name: String, role: String, description: String }],
  clues: [{ _id: false, id: String, title: String, text: String, discovered: { type: Boolean, default: false } }],
  hints: [{ _id: false, text: String }],
  solution: { type: { culpritId: String, explanation: String }, select: false },
  progress: { hintsUsed: { type: Number, default: 0 } },
  accusation: { suspectId: String, correct: Boolean },
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'solved'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Case', CaseSchema);
