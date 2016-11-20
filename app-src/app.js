'use strict';

// vendors
import * as angular from 'angular';
import * as uiRouter from 'angular-ui-router';
// import * as angularAria from 'angular-aria';
// import * as angularAnimate from 'angular-animate';
import * as angularMaterial from 'angular-material';


// controllers
import { ListController }   from './components/list/list.js';
import { ItemController }   from './components/item/item.js';

import { ReviewDialogController } from './components/reviews/reviews.js';

import { RatingController } from './components/rating/rating.js';

// services
import { UtilsService }   from './services/utils-service.js';
import { ItemsService }   from './services/items-service.js';
import { ReviewsService } from './services/reviews-service.js';

// filters
import { UnixDateToDotString, CapFirstLetters } from './filters/string-filters.js';
import { AmountToWord } from './filters/amount-filters.js';



angular.module( 'cft', ['ngMaterial', 'ui.router'] )
  .config(
    ['$mdThemingProvider', '$mdIconProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider',
    function($mdThemingProvider, $mdIconProvider, $httpProvider, $stateProvider, $urlRouterProvider)
    {
      $mdIconProvider
        .icon("preloader", "svg/preloader.svg", 48);

      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('red');

      $stateProvider
        .state(
          'list', {
            url: '/',
            views:
            {
              'content':
              {
                template: require('./components/list/list.html'),
                controller: 'ListController as lsCtrl'
              }
            }
        })
        .state(
          'item',
          {
            url: '/item/:id',
            views:
            {
              'content':
              {
                  template: require('./components/item/item.html'),
                  controller: 'ItemController as itCtrl'
              }
            }
        })
        ;

      $urlRouterProvider.otherwise('/');

  }]);

angular.module('cft')
  .controller('ListController', ['$scope', 'ItemsService', 'UtilsService', ListController])
  .controller('ItemController',
    ['$scope', '$state', '$mdDialog', 'ItemsService',
    ItemController])
  .controller('RatingController', ['$scope', RatingController])
  .controller('ReviewDialogController',
    ['$scope', '$mdDialog', 'ReviewsService', 'item', ReviewDialogController]
  )

  .service('UtilsService', [UtilsService])
  .service('ItemsService', ['$http', '$timeout', 'UtilsService', ItemsService])
  .service('ReviewsService', ['$http', ReviewsService])

  // directives
  .directive('ratingStatic', function () {
    return {
      restrict: 'E',
      scope:
      {
        rating: '@'
      },
      replace: true,
      template: require('./components/rating/rating.html'),
      controller: 'RatingController as rtCtrl'
    }
  })
  .directive('ratingClickable', function () {
    return {
      restrict: 'E',
      scope:
      {
        rating: '='
      },
      replace: true,
      template: require('./components/rating/rating-clickable.html'),
      controller: 'RatingController as rtClCtrl'
    }
  })

  .filter('UnixDateToDotString', [UnixDateToDotString])
  .filter('CapFirstLetters', [CapFirstLetters])
  .filter('AmountToWord', [AmountToWord])
  ;

require('./app.less');