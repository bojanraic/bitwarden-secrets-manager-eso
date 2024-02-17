import * as service from '../services/bwsService.js';

export async function getById(req, res, next) {
  service.getById(req, res);
};
