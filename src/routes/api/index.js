// src/routes/api/index.js
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const express = require('express');
const { get } = require('./get.js');
const { get_data } = require('./get_data');
const { info } = require('./getMetadata');

const router = express.Router();
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

router.put('/fragments/:id', rawBody(), require('./put'));

router.get('/fragments', get);
router.get('/fragments/:id/info', info);
router.get('/fragments/?expand', get);
router.get('/fragments/:id.:ext?', get_data);

router.delete('/fragments/:id', require('./delete'));

module.exports = router;
