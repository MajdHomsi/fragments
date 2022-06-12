const express = require('express');

const router = express.Router();

const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');

router.get('/fragments', require('./get'));

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

router.post('/fragments', rawBody(), require('./post'));

module.exports = router;
