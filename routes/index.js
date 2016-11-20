'use strict';

const express = require('express');
const router = express.Router();

const dbItems = require('../lib/db/db-items');
const dbReviews = require('../lib/db/db-reviews');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get(
  '/items',
  (req, res) =>
  {
    Promise.all([
      dbItems.getCategories(),
      dbItems.getItems()
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

router.get(
  '/reviews/:id',
  (req, res) =>
  {
    dbReviews.getReviews(+req.params.id)
    .then(
      reviews =>
      {
        res.json({reviews});
      }
    )
    .catch(
      err =>
      {
        console.error(err, 'get reviews route');
        res.json({reviews: []});
      }
    );
  }
);

module.exports = router;
