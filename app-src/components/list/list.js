'use strict';

export function ListController($scope, ItemsService, UtilsService)
{
  var vm = this;

  vm.items = ItemsService.items;
  vm.pagedItems = vm.filteredByCategoryItems = vm.items;

window['vm'] = vm;
  vm.showPreloader = ItemsService.refreshCounter === 0;

  vm.orderOptions =
  [
    'Title',
    'Created',
    'Category',
    'Amount',
    'SKU',
  ];

  var labels =
  [
    'name',
    'date',
    'categoryName',
    'amount',
    'sku',
  ];

  vm.orderDirections =
  [
    'Asc',
    'Desc'
  ];

  try
  {
    [vm.orderField, vm.orderDirection] = JSON.parse( localStorage.getItem('cft-test-item-order') );
  }
  catch (err) {}


  vm.availableCategories = ['All'];
  vm.appliedCategoryFilter = 'All';


  vm.availablePageSizes = [ 'All', 1, 2, 3];
  vm.pageSize = +localStorage.getItem('cft-test-page-size') || 'All';
  var pagePointer = 0;


  // wait for service to get data
  if (ItemsService.refreshCounter > 0)
  {
    copyItems();
  }

  $scope.$watch(
    () => ItemsService.refreshCounter,
    newVal =>
    {
      if (newVal > 0)
      {
        copyItems();
      }
    }
  );

  function copyItems()
  {
    vm.items = ItemsService.items.slice(0);
    vm.availableCategories = ['All'].concat(ItemsService.categories.map( e => e.name ));

    applyCategoryFilter();
    if (vm.orderField && vm.orderDirection)
    { // retrieved some sorting
      resortItems();
    }
    applyPageFilter();

    vm.showPreloader = false;
  }


  // watch sorting
  $scope.$watch(
    () => vm.orderField,
    (newVal, oldVal) =>
    {
      if (newVal && newVal !== oldVal)
      {
        resortItems();
      }
    }
  );
  $scope.$watch(
    () => vm.orderDirection,
    (newVal, oldVal) =>
    {
      if (newVal && newVal !== oldVal)
      {
        resortItems();
        applyPageFilter();
      }
    }
  );

  function resortItems()
  {
    if (vm.orderDirection && vm.orderField)
    {
      var label = labels[vm.orderOptions.indexOf(vm.orderField)];
      var direction = vm.orderDirection === 'Asc' ? -1 : 1;

      // save sort order
      localStorage.setItem('cft-test-item-order', JSON.stringify([vm.orderField, vm.orderDirection]) );

      vm.filteredByCategoryItems =
        UtilsService.mergeSort(
          vm.filteredByCategoryItems,
          (e1, e2) => e1[label] < e2[label] ? direction : e1[label] > e2[label] ? -direction : 0
        );
    }
  }

  // this way it looks more complex, but eliminates multiple repetitive filtering and sorting of the whole dataset
  $scope.$watch(
    () => vm.appliedCategoryFilter,
    (newVal, oldVal) =>
    {
      if (newVal && newVal !== oldVal)
      {
        applyCategoryFilter();
        resortItems();
        // recalculate current page
        // !here!
        applyPageFilter();
      }
    }
  );

  function applyCategoryFilter()
  {
    if (vm.appliedCategoryFilter === 'All')
    {
      vm.filteredByCategoryItems = vm.items;
    }
    else
    {
      vm.filteredByCategoryItems = vm.items.filter( e => e.categoryName === vm.appliedCategoryFilter);
    }
  }



  // handlePageSizeChange
  $scope.$watch(
    () => vm.pageSize,
    (newVal, oldval) =>
    {
      if (newVal && newVal !== oldval)
      {
        localStorage.setItem('cft-test-page-size', vm.pageSize !== 'All' ? vm.pageSize : '' );
        applyPageFilter();
      }
    }
  );

  function applyPageFilter()
  {
    if (vm.pageSize !== 'All')
    {
      vm.pagedItems =
        vm.filteredByCategoryItems
        .filter(
          (e, index) => (index >= vm.pageSize * pagePointer) && (index < vm.pageSize * (pagePointer+1))
        );
    }
    else
    {
      vm.pagedItems = vm.filteredByCategoryItems;
    }
  }

  // function handlePageSizeChange(pageSize)
  // {
  //   // save page size
  //   localStorage.setItem('cft-test-page-size', pageSize !== 'All' ? pageSize : '' );
  // }

  // vm.filterByPage =
  //   function filterByPage(item, index)
  //   {
  //     if (vm.pageSize === 'All')
  //     {
  //       return true;
  //     }
  //     else
  //     {
  //       return (index >= vm.pageSize * pagePointer) && (index < (vm.pageSize+1) * pagePointer);
  //     }
  //   };

}