const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
// src/routes/api/getMetadata.js

let fragment;
module.exports = {
  info: async (req, res) => {
    try {
      fragment = await Fragment.byId(req.user, req.params.id);
      res.status(200).json(fragment);
      logger.info({ fragmentInfo: fragment }, `Fragment metaData successfully retrieved`);
    } catch (err) {
      res
        .status(404)
        .json(createErrorResponse(404, 'Fragment metadata With Specified Id Does Not Exist'));
    }
  },
};
