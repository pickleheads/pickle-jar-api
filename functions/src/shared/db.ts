import * as mongoose from 'mongoose';

export const ACTIVE = 'active';
export const ARCHIVED = 'archived';

const ideaSchema = new mongoose.Schema({
  author: { type: String, default: 'picklehead Jackson' },
  date: { type: Date, default: Date.now },
  idea: String,
  status: {
    type: String,
    default: ACTIVE,
    enum: [ACTIVE, ARCHIVED]
  }
});

export async function connect() {
  const connection = await mongoose.createConnection(
    'mongodb://jumbert:jumbert1@ds141401.mlab.com:41401/idea-jar',
    { useNewUrlParser: true }
  );
  mongoose.model('Idea', ideaSchema);
  return connection;
}
