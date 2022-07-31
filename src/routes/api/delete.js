const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

module.exports = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  try {
    await Fragment.delete(user, id);

    logger.debug(id, 'DELETE fragment id');

    res.status(200).json(createSuccessResponse());
  } catch (err) {
    next(err);
  }
};
