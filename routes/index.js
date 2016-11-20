'use strict';

const express = require('express');
const router = express.Router();

const db = require('../lib/db/db-items');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get(
  '/items',
  (req, res) =>
  {
    Promise.all([
      db.getCategories(),
      db.getItems()
    ])
    .then(
      ([categories, items]) =>
      {
        res.json({categories, items});
      }
    )
    .catch(
      err =>
      {
        res.json({categories: {}, items: []});
      }
    );
  }
);

module.exports = router;
