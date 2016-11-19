'use strict';

export function ItemController($scope, $state, ItemsService)
{
  var vm = this;

  var itemId;

  vm.showPreloader = ItemsService.refreshCounter === 0;

  if (vm.showPreloader)
  {
    var waitForRefresh =
      $scope.$watch(
        () => ItemsService.refreshCounter,
        newVal =>
        {
          if (newVal > 0)
          {
            updateCard();
          }
       }
      );
  }
  else
  {
    updateCard();
  }

  function updateCard()
  {
    itemId = +$state.params.id;
    vm.item = ItemsService.getItemById(itemId);
    console.log(vm.item);

    vm.showPreloader = false;
  }

  console.log('item controller');
}