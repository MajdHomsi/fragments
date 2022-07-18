const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
require('dotenv').config();
var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

let fragment, fragmentM;
module.exports = {
  get: async (req, res) => {
    if (req.user) {
      if (req.query) {
        if (req.params.id) {
          let fragmentId = req.params.id.toString().split('.');
          try {
            fragmentM = await Fragment.byId(req.user, fragmentId[0]);
            fragment = await fragmentM.getData();
            if (fragmentId.length > 1) {
              let ext = fragmentId[1];
              if (ext == 'html') {
                if (fragmentM.type == 'text/markdown') {
                  res.set('Content-Type', 'text/html');
                  var result = md.render(fragment.toString());
                  res.status(200).send(result);
                  logger.info({ targetType: ext }, `Successfully Convert To ${ext}`);
                } else {
                  res
                    .status(415)
                    .json(createErrorResponse(415, `Fragment cannot Be Returned As a ${ext}`));
                }
              }
            } else {
              res.set('Content-Type', fragmentM.type);
              res.status(200).send(fragment);
              logger.info(
                { fragmentData: fragment, contentType: fragmentM.type },
                `Successfully Get Fragment Data`
              );
            }
          } catch (err) {
            res
              .status(404)
              .json(createErrorResponse(404, `id Specified Does Not Represent a Valid Fragment`));
          }
        } else {
          try {
            fragment = await Fragment.byUser(req.user, req.query.expand);
          } catch (err) {
            res.status(404).json(createErrorResponse(404, 'No Such User Found'));
          }
          res.status(200).json(createSuccessResponse({ fragments: fragment }));
          logger.info({ fragmentList: fragment }, `Successfully Get Fragment List`);
        }
      }
    }
  },
  info: async (req, res) => {
    if (req.query) {
      if (req.params.id) {
        try {
          fragment = await Fragment.byId(req.user, req.params.id);
          res.status(200).json(fragment);
          logger.info({ fragmentInfo: fragment }, `Successfully Get Fragment Metadata`);
        } catch (err) {
          res
            .status(404)
            .json(
              createErrorResponse(404, 'Unable To Locate fragment Metadata With The Specified id')
            );
        }
      }
    }
  },
};
