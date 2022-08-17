const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');
// src/routes/api/get_data.js

let fragment, fragMeta, result;
module.exports = {
  get_data: async (req, res) => {
    let q = path.parse(req.params.id);
    let ext = req.params.ext ? req.params.ext : '';
    try {
      fragMeta = await Fragment.byId(req.user, q.name);
      fragMeta = new Fragment({ ...fragMeta });
      ext = fragMeta.extConvert(ext);
      fragment = await fragMeta.getData();
      if (q.ext == '' || fragMeta.type.endsWith(ext)) {
        res.setHeader('Content-Type', fragMeta.type);
        res.status(200).send({ data: fragment, type: fragMeta.type });
        logger.info(
          { fragmentData: fragment, contentType: fragMeta.type },
          `successfully get fragment data`
        );
      } else {
        try {
          if (fragMeta.isText || fragMeta.type == 'application/json') {
            result = await fragMeta.txtConvert(ext);
            res.setHeader('Content-Type', 'text/' + ext);
            res.status(200).send({ result: fragment, type: fragMeta.type });
            //res.status(200).send(Buffer.from(result));
            logger.info({ targetType: ext }, `successfully converted to ${ext}`);
          } else {
            result = await fragMeta.imgConvert(ext);
            res.setHeader('Content-Type', 'image/' + ext);
            res.status(200).send({ data: result, type: ext })(result);
            logger.info({ targetType: ext }, `successfully converted to ${ext}`);
          }
        } catch (err) {
          res.status(415).json(createErrorResponse(415, `Unable to return fragment as ${ext}`));
        }
      }
    } catch (err) {
      res.status(404).json(createErrorResponse(404, `ID is invalid`));
    }
  },
};
