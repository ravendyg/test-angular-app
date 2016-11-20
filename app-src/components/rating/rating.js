'use strict';

export function RatingController($scope)
{
	var vm = this;

  rerenderRating();

  vm.setRating = event =>
  {
    $scope.rating = +event.target.dataset.id;
    rerenderRating();
    $scope.$watch(
      () => $scope.rating,
      (newVal, oldVal) =>
      {
        console.log($scope.rating);
        if (newVal !== oldVal)
        {
          rerenderRating();
        }
      }
    );
  };

  function rerenderRating()
  {
    vm.rating = $scope.rating;
    vm.ratingRender = [];

    for (var i = 1; i <= 5; i++)
    {
      if ( i <= Math.floor(vm.rating) )
      {
        vm.ratingRender.push({i, val:``});
      }
      else
      {
        if (i === Math.ceil(vm.rating))
        {
          vm.ratingRender.push({i, val:`-half-o`});
        }
        else
        {
          vm.ratingRender.push({i, val:`-o`});
        }
      }
    }
  }


}