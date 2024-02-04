import * as service from '../services/bwsService.js';

export function getById(req, res, next) {
  service.getById(req, res);
};
