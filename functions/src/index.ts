import * as express from 'express';
import * as functions from 'firebase-functions';
import { cloudFunction } from './shared/utils/cloud-function';
import { getIdeaIdFromReq } from './shared/utils/req';
import { CustomError } from './shared/types/custom-error';
import { CustomRequest } from './shared/types/custom-request';
import { ACTIVE, ARCHIVED } from './shared/db/schemas/idea';

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
    const ideaId = getIdeaIdFromReq(req);
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

exports.unarchiveIdea = functions.https.onRequest(
  cloudFunction(async (req: CustomRequest, res: express.Response) => {
    if (req.method !== 'PUT') {
      throw METHOD_NOT_SUPPORTED_ERROR;
    }
    const ideaId = getIdeaIdFromReq(req);
    try {
      // @ts-ignore
      const updatedIdea = await req.db
        .model('Idea')
        .findOneAndUpdate({ _id: ideaId }, { status: ACTIVE }, { new: true });
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
    const ideaId = getIdeaIdFromReq(req);
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
    if (status) {
      query.status = status;
    }
    const skip = req.query.skip && parseInt(req.query.skip) || 0;
    try {
      console.log({ query });
      // @ts-ignore
      const count = await req.db.model('Idea').count(query);
      if (skip >= count) {
        res
          .status(400)
          .send({ message: `Invalid skip number provided: ${skip}` });
        return;
      }
      // @ts-ignore
      const ideas = await req.db
        .model('Idea')
        .find(query)
        .skip(skip)
        .limit(10)
        .exec();
      res.status(200).send({ count, ideas });
      // @ts-ignore
      await req.db.close();
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  })
);
