import * as mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  idea: String,
  author: { type: String, default: 'picklehead Jackson' },
  date: { type: Date, default: Date.now },
});

export async function connect() {
  const connection = await mongoose.createConnection(
    'mongodb://jumbert:jumbert1@ds141401.mlab.com:41401/idea-jar',
    { useNewUrlParser: true }
  );
  mongoose.model('Idea', ideaSchema);
  return connection;
}
