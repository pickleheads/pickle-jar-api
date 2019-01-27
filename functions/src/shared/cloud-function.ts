import * as express from 'express';
import * as mongoose from 'mongoose';
import { connect } from './db';

export interface CustomRequest extends express.Request {
  db?: mongoose.Mongoose;
}
export function cloudFunction(fn: Function) {
  return async (req: CustomRequest, res: express.Response) => {
    let dbConnection;
    try {
      dbConnection = await connect();
      // @ts-ignore
      req.db = dbConnection;
      await fn(req, res);
    } catch (error) {
      // @ts-ignore
      await dbConnection.close();
      console.error(error);
      res.status(error.statusCode || 500).send({ error });
    }
  };
}
