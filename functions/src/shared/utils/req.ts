import { CustomError } from '../types/custom-error';
import { CustomRequest } from '../types/custom-request';

const IDEA_ID_ERROR: CustomError = new Error('Missing required idea ID');
IDEA_ID_ERROR.statusCode = 400;

export function getIdeaIdFromReq(req: CustomRequest) {
  const ideaId = req.query.ideaId;
  if (!ideaId) {
    throw IDEA_ID_ERROR;
  }
  return ideaId;
}
