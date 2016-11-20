'use strict';

const db = require('./db.js').db;

const getCategoriesQuery =
	'SELECT * FROM categories;';
function getCategoriesPromised(resolve)
{
  db.connection.query(
    getCategoriesQuery,
    [],
    (err, res) =>
    {
      if (err)
      {
        console.error(err, 'getCategoriesQuery');
        resolve({});
      }
      else
      {
        let catDict = {};
        for (let cat of res)
        {
          catDict[cat.id] = cat.name;
        }
        resolve(catDict);
      }
    }
  );
}
function getCategories()
{
  return new Promise( getCategoriesPromised );
}
module.exports.getCategories = getCategories;

const getItemsQuery =
  'SELECT *, UNIX_TIMESTAMP(created) AS created FROM items;';
function getItemsPromised(resolve)
{
  db.connection.query(
    getItemsQuery,
    [],
    (err, res) =>
    {
      if (err)
      {
        console.error(err, 'getItemsQuery');
        res = [];
      }
      resolve(res)
    }
  );
}
function getItems()
{
  return new Promise( getItemsPromised );
}
module.exports.getItems = getItems;