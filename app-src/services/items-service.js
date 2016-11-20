'use strict';

import { config } from '../config';

export function ItemsService($http, $timeout, UtilsService)
{
  var self =
  {
    refreshCounter: 0,
    items: [],
    categories: [],

    fetchItems()
    {
      $http({
        method: 'GET',
        url: '/items',
      })
      .then(
        resp =>
        {
          var items = resp.data.items;
          var categories = resp.data.categories;

          // transfer categories separately
          self.items =
            items.map(
              e =>
              {
                e.categoryName = categories[''+e.category];
                return e;
              }
            );
          // would need a list of categories instead of dict
          for (var catId of Object.keys(categories) )
          {
            self.categories.push({
              id: catId,
              name: categories[catId]
            });
          }
          self.refreshCounter++;
        }
      )
      .catch(
        err =>
        {
          console.error(err);
          self.refreshCounter++;
        }
      );
    },

    getItemById(id)
    {
      return self.items.find(e => e.id === id);
    }
  };

  // initial load
  self.fetchItems();

  return self;
}