'use strict';

// vendors
import * as angular from 'angular';
import * as uiRouter from 'angular-ui-router';
// import * as angularAria from 'angular-aria';
// import * as angularAnimate from 'angular-animate';
import * as angularMaterial from 'angular-material';


// controllers
import { ListController } from './components/list/list.js';
import { ItemController } from './components/item/item.js';

// services
import { UtilsService } from './services/utils-service.js';
import { ItemsService } from './services/items-service.js';

// filters
import { UnixDateToDotString, CapFirstLetters } from './filters/string-filters.js';
import { AmountToWord } from './filters/amount-filters.js';



angular.module( 'cft', ['ngMaterial', 'ui.router'] )
  .config(function($mdThemingProvider, $mdIconProvider, $httpProvider, $stateProvider, $urlRouterProvider)
  {
    $mdIconProvider
    //     .icon("share", "angular/assets/svg/share.svg", 24)
    //     .icon("menu", "angular/assets/svg/menu.svg", 24)
    //     .icon("create", "angular/assets/svg/create.svg", 24)
    //     .icon("remove", "angular/assets/svg/remove.svg", 24)
    //     .icon("reorder", "angular/assets/svg/reorder.svg", 24)
    //     .icon("add", "angular/assets/svg/add.svg", 24)
    //     .icon("account", "angular/assets/svg/account.svg", 24)
    //     .icon("comment", "angular/assets/svg/comment.svg", 24)
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

});

angular.module('cft')
  .controller('ListController', ['$scope', 'ItemsService', 'UtilsService', ListController])
  .controller('ItemController', ['$scope', '$state', 'ItemsService', ItemController])

  .service('UtilsService', [UtilsService])
  .service('ItemsService', ['$http', '$timeout', 'UtilsService', ItemsService])

  .filter('UnixDateToDotString', [UnixDateToDotString])
  .filter('CapFirstLetters', [CapFirstLetters])
  .filter('AmountToWord', [AmountToWord])
  ;

require('./app.less');