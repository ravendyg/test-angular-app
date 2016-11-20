'use strict';

const db = require('./db.js').db;

const getReviewsQuery =
	'SELECT * FROM reviews WHERE item=?;';
function getReviewsPromised(itemId, resolve)
{
  db.connection.query(
    getReviewsQuery,
    [itemId],
    (err, res) =>
    {
      if (err)
      {
        console.error(err, 'getReviewsQuery');
        res = [];
      }
      resolve(res);
    }
  );
}
function getReviews(itemId)
{
  return new Promise( getReviewsPromised.bind(this, itemId) );
}
module.exports.getReviews = getReviews;

const createReviewQuery =
	'INSERT INTO reviews SET ?;';
function createReviewPromised(review, resolve, reject)
{
  db.connection.query(
    createReviewQuery,
    review,
    (err, res) =>
    {
      if (err || !res.insertId)
      {
        reject();
      }
      else
      {
        resolve(
          Object.assign(review, {id: res.insertId})
        );
      }
    }
  );
}
function createReview(review)
{
  return new Promise( createReviewPromised.bind(this, review) );
}
module.exports.createReview = createReview;
