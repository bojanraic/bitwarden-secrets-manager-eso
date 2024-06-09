import * as service from '../services/bwsService.js';
export async function getByIdOrName(req, res, next) {
  service.getByIdOrName(req, res);
};
