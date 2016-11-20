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
    },
    {
      name: 'cat name 5'
    },
    {
      name: 'cat name 6'
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
      description: ' have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All ',
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
    },
    {
      sku: 'SCV00011',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 * 6,
      category: 5,
      name: 'item 6',
      description: 'bla-bla-bla 6',
      amount: 10,
      img: '00003.jpg'
    },
    {
      sku: 'SCQ00010',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 * 7,
      category: 6,
      name: 'item 6',
      description: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCG00010',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 * 8,
      category: 2,
      name: 'item 8',
      description: ' Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCL00010',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 3,
      name: 'item 9',
      description: 'bla-bla-bla 9',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCR00010',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item 10',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCL00011',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item11',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCL00012',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item 12',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCL00013',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item 13',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCL00014',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item 14',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCL00015',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item 15',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCL00016',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item 16',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    },
    {
      sku: 'SCL00017',
      created: utils.getUnixTimestamp() - 60 * 60 * 24 *  2,
      category: 2,
      name: 'item 17',
      description: 'bla-bla-bla 5',
      amount: 100,
      img: '00003.jpg'
    }
    ];

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
