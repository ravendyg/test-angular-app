'use strict';

const config = require('./../config.js');
const utils = require('../utils');
const db = require('./db.js').db;

/**
 * reset tables
 */
function resetTables ()
{
  // drop all
  function main (resolve, reject)
  {
    db.connection.query(
      'DROP TABLE IF EXISTS reviews;',
      err =>
      {
        if (err)
        {
          reject(err);
        }
        else
        {
          db.connection.query(
            'DROP TABLE IF EXISTS items;',
            err =>
            {
              if (err)
              {
                reject(err);
              }
              else
              {
                db.connection.query(
                  'DROP TABLE IF EXISTS categories;',
                  err =>
                  {
                    if (err)
                    {
                      reject(err);
                    }
                    else { resolve( new Promise(resetAllTables) ); }
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  // reset all
  function resetAllTables(resolveReset, rejectReset)
  {
    return new Promise(resetCategories)
    .then( populateCategories )
    .then( () => new Promise(resetItems) )
    .then( populateItems )
    .then( () => new Promise(resetReviews) )
    .then(
      () =>
      {
        return resolveReset();
      }
    )
    .catch(
      err =>
      {
        return rejectReset(err);
      }
    )
    ;
  }

/** CATEGORIES
 *
 * - id: unsigned int autoincrement
 * - name: varchar(20)
 */
  function resetCategories( resolve, reject )
  {
    db.connection.query(
      'CREATE TABLE'
        + ' categories'
        + ' (id INT UNSIGNED NOT NULL AUTO_INCREMENT'
        + ', name CHAR(?) NOT NULL'
        + ', PRIMARY KEY (id)'
        + ', UNIQUE  KEY (name)'
        + ') character set utf8;',
      [ config.CATEGORY_NAME_LENGTH_LIMIT ],
      err =>
      {
        if (err) { reject(err); }
        else { resolve(); }
      }
    );
  }

  function populateCategories()
  {
    let cats =
    [{
      name: 'cat name 1'
    },
    {
      name: 'cat name 2'
    },
    {
      name: 'cat name 3'
    },
    {
      name: 'cat name 4'
    }];

    let calls =
      cats.map(
        e => new Promise(
          resolve =>
          {
            db.connection.query(
              'INSERT INTO categories SET ?;',
              e,
              (err, res) =>
              {
                resolve();
              }
            );
          }
      )
    );

    return Promise.all(calls);
  }

/** ITEMS
 *
 * - id: unsigned int           // autoincrement
 * - sku: char(20)
 * - name: varchar(250)
 * - description: text
 * - amount: unsigned int
 * - img: varchar(250)          // url
 * - category: unsigned int     // Categories.id
 * - created: timestamp
*/
  function resetItems(resolve, reject)
  {
    db.connection.query(
      'create table'
        + ' items'
        + ' (id INT UNSIGNED NOT NULL AUTO_INCREMENT'
        + ', sku CHAR(?) NOT NULL'
        + ', name VARCHAR(?) NOT NULL'
        + ', description TEXT NOT NULL'
        + ', amount INT UNSIGNED NOT NULL DEFAULT 0'
        + ', img VARCHAR(?) NOT NULL'
        + ', category INT UNSIGNED NOT NULL'
        + ', created TIMESTAMP NOT NULL DEFAULT NOW()'
        + ', PRIMARY KEY (id)'
        + ', FOREIGN KEY (category) REFERENCES categories(id)'
        + ') character set utf8;',
        [config.SKU_SIZE_LIMIT, config.ITEM_NAME_SIZE_LIMIT, config.IMAGE_URL_LENGTH_LIMIT],
      err =>
      {
        if (err) { reject(err); }
        else { resolve(); }
      }
    );
  }

  function populateItems()
  {
    let cats =
    [{
      sku: 'SCU00010',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 * 5,
      category: 1,
      name: 'item 1',
      description: 'bla-bla-bla 1',
      amount: 10,
      img: '00001.jpg'
    },
    {
      sku: 'SCU00002',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  3,
      category: 1,
      name: 'item 2',
      description: 'bla-bla-bla 2',
      amount: 1,
      img: '00002.jpg'
    },
    {
      sku: 'SCL00010',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item 5',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    }];

    let calls =
      cats.map(
        e => new Promise(
          resolve =>
          {
            db.connection.query(
              // 'INSERT INTO items SET ?;',
              'INSERT INTO items ' +
              '(sku, created, category, name, description, amount, img) ' +
              'VALUES (?, FROM_UNIXTIME(?), ?, ?, ?, ?, ?);',
              [e.sku, e.created, e.category, e.name, e.description, e.amount, e.img],
              (err, res) =>
              {
                resolve();
              }
            );
          }
      )
    );

    return Promise.all(calls);
  }

/** REVIEWS
 *
 * - id: unsigned int           // autoincrement
 * - content: text
 * - rating: unsigned tiny int
 * - item: unsigned int         // Items.id
 * - created: timestamp         // UNIX timestamp
*/
  function resetReviews(resolve, reject)
  {
    db.connection.query(
      'create table'
        + ' reviews'
        + ' (id INT UNSIGNED NOT NULL AUTO_INCREMENT'
        + ', content TEXT NOT NULL'
        + ', rating TINYINT UNSIGNED NOT NULL'
        + ', item INT UNSIGNED NOT NULL'
        + ', PRIMARY KEY (id)'
        + ', FOREIGN KEY (item) REFERENCES items(id)'
        + ') character set utf8;',
        [],
      err =>
      {
        if (err) { reject(err); }
        else { resolve(); }
      }
    );
  }

  return new Promise( main );
}


resetTables();
