import * as express from 'express';
import * as functions from 'firebase-functions';
import { cloudFunction, CustomRequest } from './shared/cloud-function';
import { ARCHIVED } from './shared/db';

interface CustomError extends Error {
  statusCode?: number;
}

const IDEA_ID_ERROR: CustomError = new Error('Missing required idea ID');
IDEA_ID_ERROR.statusCode = 400;
const METHOD_NOT_SUPPORTED_ERROR: CustomError = new Error(
  'Method not supported'
);
METHOD_NOT_SUPPORTED_ERROR.statusCode = 405;

exports.addIdea = functions.https.onRequest(
  cloudFunction(async (req: CustomRequest, res: express.Response) => {
    if (req.method !== 'POST') {
      throw METHOD_NOT_SUPPORTED_ERROR;
    }
    const ideaToCreate = req.body;
    try {
      // @ts-ignore
      const createdIdea = await req.db.model('Idea').create(ideaToCreate);
      res.status(201).send({ idea: createdIdea });
      // @ts-ignore
      await req.db.close();
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  })
);

exports.archiveIdea = functions.https.onRequest(
  cloudFunction(async (req: CustomRequest, res: express.Response) => {
    if (req.method !== 'PUT') {
      throw METHOD_NOT_SUPPORTED_ERROR;
    }
    const ideaId = req.query.ideaId;
    if (!ideaId) {
      throw IDEA_ID_ERROR;
    }
    try {
      // @ts-ignore
      const updatedIdea = await req.db
        .model('Idea')
        .findOneAndUpdate({ _id: ideaId }, { status: ARCHIVED }, { new: true });
      res.status(200).send({ idea: updatedIdea });
      // @ts-ignore
      await req.db.close();
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  })
);

exports.deleteIdea = functions.https.onRequest(
  cloudFunction(async (req: CustomRequest, res: express.Response) => {
    if (req.method !== 'DELETE') {
      throw METHOD_NOT_SUPPORTED_ERROR;
    }
    const ideaId = req.query.ideaId;
    if (!ideaId) {
      throw IDEA_ID_ERROR;
    }
    try {
      // @ts-ignore
      const deletedIdea = await req.db.model('Idea').deleteOne({ _id: ideaId });
      res.status(200).send({ idea: deletedIdea });
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
    const query: any = {};

    const status = req.query.status;
    if(status) {
      query.status = status;
    }

    try {
      console.log({ query });
      // @ts-ignore
      const ideas = await req.db.model('Idea').find(query);
      res.status(200).send({ ideas });
      // @ts-ignore
      await req.db.close();
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  })
);
