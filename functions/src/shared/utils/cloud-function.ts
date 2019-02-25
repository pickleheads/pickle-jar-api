import * as express from 'express';
import { connect } from '../db/connect';
import { CustomRequest } from '../types/custom-request';

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
