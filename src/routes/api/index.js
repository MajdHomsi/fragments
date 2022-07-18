// src/routes/api/index.js
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');

const express = require('express');
const { get, info } = require('./get.js');

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
router.get('/fragments', get);
router.get('/fragments/:id/info', info);
router.get('/fragments/?expand', get);
router.get('/fragments/:id', get);

module.exports = router;
