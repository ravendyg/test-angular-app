'use strict';

export function ItemsService($http, $timeout, UtilsService)
{
  var hardcodeItems =
  [{
    id: 1,
    sku: 'SCU00010',
    date: UtilsService.getUnixTimestamp() - 60 * 60 * 24 * 5,
    categoryId: 1,
    name: 'item 1',
    description: 'bla-bla-bla 1',
    amount: 10,
    img: '00001.jpg'
  },
  {
    id: 2,
    sku: 'SCU00002',
    date: UtilsService.getUnixTimestamp() - 60 * 60 * 24 *  3,
    categoryId: 1,
    name: 'item 2',
    description: 'bla-bla-bla 2',
    amount: 1,
    img: '00002.jpg'
  },
  {
    id: 5,
    sku: 'SCL00010',
    date: UtilsService.getUnixTimestamp() - 60 * 60 * 24 *  2,
    categoryId: 2,
    name: 'item 5',
    description: 'bla-bla-bla 5',
    amount: 100,
    img: '00003.jpg'
  }];

  var hardcodedCategories =
  {
    '1': 'cat name 1',
    '2': 'cat name 2'
  };

  var self =
  {
    refreshCounter: 0,
    items: [],
    categories: [],

    fetchItems()
    {
      $timeout(
        () =>
        {
          // convert Unix to js timestamp
          for (var item of hardcodeItems)
          {
            item.date *= 1000;
          }

          // transfer categories separately
          self.items =
            hardcodeItems.map(
              e =>
              {
                e.categoryName = hardcodedCategories[''+e.categoryId];
                return e;
              }
            );
          // would need a list of categories instead of dict
          for (var catId of Object.keys(hardcodedCategories) )
          {
            self.categories.push({
              id: catId,
              name: hardcodedCategories[catId]
            });
          }
          self.refreshCounter++;
        },
        200
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