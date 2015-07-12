// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','firebase', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $http, $window, $rootScope) {

  $rootScope.baseUrl = "http://localhost:3000"
  // $rootScope.baseUrl = "http://104.131.150.241"
  console.log($window.localStorage['currentUser'])
  if ($window.localStorage['currentUser']) {
    $http.defaults.headers.common["Authorization"] = "Token token=" + $window.localStorage['currentUser'];
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js


  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'AppCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
      url: '/home',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('tab.user-id', {
      url: '/users/:id',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'templates/user-id.html',
          controller: 'UserIdCtrl'
        }
      }
    })
    .state('tab.post-id', {
      url: '/posts/:id',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'templates/post-id.html',
          controller: 'PostIdCtrl'
        }
      }
    })
  .state('tab.write', {
    url: '/write',
    views: {
      'tab-write': {
        templateUrl: 'templates/tab-write.html',
        controller: 'WriteCtrl'
      }
    }
  })
  .state('tab.crosslang', {
    url: '/crosslang',
    // cache: false,
    views: {
      'tab-crosslang': {
        templateUrl: 'templates/tab-crosslang.html',
        controller: 'CrosslangCtrl'
      }
    }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
