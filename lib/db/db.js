'use strict';

/** DB setup and some helper functions */
const events = require('events');
const emitter = new events.EventEmitter();

const config = require('./../config.js');

// db set up
const mysql = require('mysql');
const db = { emitter };
module.exports.db = db;

let dbStarted = false;


function handleDisconnect ()
{
  db.connection = mysql.createConnection({
    host    : config.DB_HOST,
    user    : config.DB_USER,
    password: config.DB_PAS,
    database: config.DB_NAME,
    charset: 'utf8mb4'
  });

  db.connection.connect(
    err =>
    {
      if ( err )
      {
        console.error( (new Date()).toLocaleString(), 'error connecting to db', err);
        setTimeout( () => { handleDisconnect(); }, 200 );
      }
      else
      {
        console.log( (new Date()).toLocaleString(), 'CONNECTED TO DB');
        if ( !dbStarted )
        {
          dbStarted = true;
          db.emitter.emit('connected');
        }
      }
    }
  );

  db.connection.on(
    'error',
    err =>
    {
      console.error( (new Date()).toLocaleString(), 'connection error', err);
      if ( err.code === 'PROTOCOL_CONNECTION_LOST' )
      {
        handleDisconnect();
      }
      else
      {
        throw(err);
      }
    }
  );
}

handleDisconnect();