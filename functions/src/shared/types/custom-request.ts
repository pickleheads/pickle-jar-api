import * as express from 'express';
import * as mongoose from "mongoose";

export interface CustomRequest extends express.Request {
  db?: mongoose.Mongoose;
}