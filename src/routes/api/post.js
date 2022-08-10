const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
require('dotenv').config();

module.exports = async (req, res) => {
  let fragment;
  const api = process.env.API_URL;
  if (Buffer.isBuffer(req.body)) {
    fragment = new Fragment({
      ownerId: req.user,
      type: req.get('content-type'),
      size: req.body.length,
    });
    await fragment.setData(req.body);
    res.location(`${api}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));
    logger.info({ fragment: fragment }, `Successfully Posted Fragment `);
  } else {
    res.status(415).json(createErrorResponse(415, 'not supported type'));
    logger.info(`Unable to Post Fragment`);
  }
};
