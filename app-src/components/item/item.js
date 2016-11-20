'use strict';

import { ReviewDialogTemplate } from '../reviews/reviews.js';

export function ItemController($scope, $state, $mdDialog, ItemsService)
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

    vm.showPreloader = false;
  }

  vm.showReviews = event =>
  {
    $mdDialog.show({
      controller: 'ReviewDialogController as rvCtrl',
      template: ReviewDialogTemplate,
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: { item: vm.item }
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

}