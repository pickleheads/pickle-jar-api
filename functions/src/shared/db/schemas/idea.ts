import * as mongoose from "mongoose";

export const ACTIVE = 'active';
export const ARCHIVED = 'archived';

export const ideaSchema = new mongoose.Schema({
  author: { type: String, default: 'picklehead Jackson' },
  categories: [{type: String}],
  date: { type: Date, default: Date.now },
  idea: {type: String, required: true},
  status: {
    type: String,
    default: ACTIVE,
    enum: [ACTIVE, ARCHIVED]
  }
});