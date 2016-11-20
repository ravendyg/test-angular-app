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
