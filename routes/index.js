'use strict';

const express = require('express');
const router = express.Router();

const config = require('../lib/config');

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

router.post(
  '/reviews',
  (req, res) =>
  {
    if (!req.body.content ||
      !(req.body.rating > 0 && req.body.rating <= 5) ||
      typeof req.body.item !== 'number'
    )
    {
      res.status(400).json({status: 'bad data'});
    }
    else
    {
      dbReviews.createReview({
        content: req.body.content.slice(0, config.REVIEW_SIZE_LIMIT),
        rating: req.body.rating,
        item: req.body.item
      })
      .then(
        review =>
        {
          res.json({review});
        }
      )
      .catch(
        () =>
        {
          res.status(400).json({status: 'bad data'});
        }
      );
    }
  }
);

module.exports = router;
