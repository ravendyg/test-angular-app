'use strict';

const self =
{
  PORT: 3019,

  DB_HOST: '127.0.0.1',
  DB_USER: 'cft_test',
  DB_PAS : 'cfttest',
  DB_NAME: 'cft_test',

  CATEGORY_NAME_LENGTH_LIMIT: 20,
  SKU_SIZE_LIMIT: 20,
  ITEM_NAME_SIZE_LIMIT: 250,
  ITEM_DESCRIPTION_SIZE_LIMIT: 4000,
  REVIEW_SIZE_LIMIT: 150,
  IMAGE_URL_LENGTH_LIMIT: 250,
};

module.exports = self;