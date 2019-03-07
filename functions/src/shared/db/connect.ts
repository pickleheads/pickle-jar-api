import * as mongoose from 'mongoose';
import { ideaSchema } from './schemas/idea';

export async function connect() {
  const connection = await mongoose.createConnection(
    'mongodb://jumbert:jumbert1@ds141401.mlab.com:41401/idea-jar',
    { useNewUrlParser: true },
  );
  mongoose.model('Idea', ideaSchema);
  return connection;
}