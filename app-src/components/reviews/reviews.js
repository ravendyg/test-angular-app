'use strict';

export function ReviewDialogController($scope, $mdDialog, ReviewsService, item)
{
  var vm = this;

  vm.item = item;
  vm.reviews = [];
  vm.reviewMaxLength = 150;

  vm.newReview =
  {
    content: '',
    rating: 1
  };

  // force refresh
  $scope.$watch(
    () => ReviewsService.refreshIndex,
    (newVal, oldVal) =>
    {
      if (newVal && newVal !== oldVal)
      {
        vm.reviews = ReviewsService.reviews.slice(0);
      }
    }
  );

  ReviewsService.fetchReviews(item.id);

  // methods
  vm.reviewIncorrect =
    () => (!vm.newReview.content ||
          vm.newReview.content.length <= 0 ||
          vm.newReview.content.length > vm.reviewMaxLength
          ) ||
          (vm.newReview.rating <= 0 ||
          vm.newReview.rating > 5)
          ;

  vm.sendReview = () =>
  {
    if (!vm.reviewIncorrect())
    {
      ReviewsService.sendReview(vm.newReview, item.id);
    }
  };
}

export var ReviewDialogTemplate = require('./reviews.html');
