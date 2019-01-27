import * as express from 'express';
import * as functions from 'firebase-functions';
import * as mongoose from 'mongoose';
import { cloudFunction, CustomRequest } from './shared/cloud-function';

interface Idea extends mongoose.Document {
  idea: string;
  author: string;
  date: Date;
}

interface CustomError extends Error {
  statusCode?: number;
}
const METHOD_NOT_SUPPORTED_ERROR: CustomError = new Error('Method not supported');
METHOD_NOT_SUPPORTED_ERROR.statusCode = 405;


exports.addIdea = functions.https.onRequest(
  cloudFunction(async (req: CustomRequest, res: express.Response) => {
    if (req.method !== 'POST') {
      throw METHOD_NOT_SUPPORTED_ERROR
    }
    const ideaToCreate: Idea = req.body;
    try {
      // @ts-ignore
      const createdIdea = await req.db.model('Idea').create(ideaToCreate);
      res.status(200).send({ idea: createdIdea });
      // @ts-ignore
      await req.db.close();
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  })
);

exports.listIdeas = functions.https.onRequest(
  cloudFunction(async (req: CustomRequest, res: express.Response) => {
    if (req.method !== 'GET') {
      throw METHOD_NOT_SUPPORTED_ERROR;
    }
    try {
      // @ts-ignore
      const ideas = await req.db.model('Idea').find({});
      res.status(200).send({ ideas });
      // @ts-ignore
      await req.db.close();
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  })
);
