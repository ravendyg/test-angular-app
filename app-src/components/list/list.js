'use strict';

export function ListController($scope, ItemsService, UtilsService)
{
  var vm = this;

  vm.items = ItemsService.items;
  vm.pagedItems = vm.filteredByCategoryItems = vm.items;

window['vm'] = vm;
  vm.showPreloader = ItemsService.refreshCounter === 0;

  // table ordering
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
  // \table ordering


  vm.availableCategories = ['All'];
  vm.appliedCategoryFilter = 'All';

  // pagination
  vm.availablePageSizes = [ 'All', 1, 2, 3];
  vm.pageSize = +localStorage.getItem('cft-test-page-size') || 'All';
  vm.pages = [];  // displayed number, empty if mode 'All'
  vm.currentPage = 1;
  // \pagination


  // there are already data, get them
  if (ItemsService.refreshCounter > 0)
  {
    copyItems();
  }

  // dynamic refresh from the server not implemented
  // thus fired once, if /list is an app enter point
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
    recalculatePages();

    vm.showPreloader = false;
  }

  /** catefory filter changed */
  // this way it looks more complex, but eliminates multiple repetitive filtering and sorting of the whole dataset
  $scope.$watch(
    () => vm.appliedCategoryFilter,
    (newVal, oldVal) =>
    {
      if (newVal && newVal !== oldVal)
      {
        applyCategoryFilter();
        resortItems();
        recalculatePages();
      }
    }
  );

  function applyCategoryFilter()
  { // filter storage not required
    if (vm.appliedCategoryFilter === 'All')
    {
      vm.filteredByCategoryItems = vm.items;
    }
    else
    {
      vm.filteredByCategoryItems = vm.items.filter( e => e.categoryName === vm.appliedCategoryFilter);
    }
  }

  /** sorting changed */
  $scope.$watch(
    () => vm.orderField,
    (newVal, oldVal) =>
    {
      if (newVal && newVal !== oldVal)
      {
        resortItems();
        recalculatePages();
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
        recalculatePages();
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


  // handlePageSizeChange
  $scope.$watch(
    () => vm.pageSize,
    (newVal, oldval) =>
    {
      if (newVal && newVal !== oldval)
      {
        localStorage.setItem('cft-test-page-size', vm.pageSize !== 'All' ? vm.pageSize : '' );
        recalculatePages();
      }
    }
  );

  function recalculatePages()
  {
    vm.currentPage = 1;

    if (vm.pageSize !== 'All')
    {
      vm.pagedItems = vm.filteredByCategoryItems.slice(0, vm.pageSize);

      vm.pages = [];
      for (var num = 1; num <= Math.ceil(vm.filteredByCategoryItems.length/vm.pageSize); num++)
      { // first active by default
        vm.pages.push({
          num, active: num === 1
        });
      }
    }
    else
    {
      vm.pagedItems = vm.filteredByCategoryItems.slice(0);
      vm.pages = [];
    }
  }

  vm.setPage = pageNum =>
  {
    if (pageNum <= vm.pages.length && pageNum > 0)
    {
      vm.currentPage = pageNum;
    }
    vm.pagedItems = vm.filteredByCategoryItems.slice(
      (pageNum - 1) * vm.pageSize,
      pageNum * vm.pageSize
    );
  };

}


/**
 * first page is always enter point - no requirenment provided for keeping previous in memory
 *
 * possible user actions:
 * - select filter by category
 *    -> filter initial list
 *    -> apply ordering if any
 *    -> recalculate pages, back to first   // assume new query, no need to stay on the same page
 *
 * - select order prop and direction
 *    -> apply new order to filtered list
 *    -> recalculate pages, back to first
 *
 * - change page size
 *    -> recalculate pages, back to first   // here logic is not clear, therefore not required, not implemented
 */