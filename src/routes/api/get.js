const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  logger.debug('req.query in get: ' + JSON.stringify(req.query));

  const expand = req.query.expand === '1';

  try {
    const fragments = await Fragment.byUser(req.user, expand);

    res.status(200).json(
      createSuccessResponse({
        fragments: fragments,
      })
    );
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
//GET /fragments/:id/info returns an existing fragment's metadata
module.exports.getInfo = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  try {
    const fragment = await Fragment.byId(user, id);
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (error) {
    next(error);
  }
};
