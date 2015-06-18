// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $http, $window, $rootScope) {
  // AV.initialize("2sgwr9lae382ysns89oau0o8tx76fylyna5dqhp21vyi8iy5", "g88pb2mf8s75e2iel5jgnlfwwyfbng38dd079xevfzg3t4n3");
  $rootScope.baseUrl = "http://localhost:3000"

  // $rootScope.baseUrl = "http://104.131.150.241"
  console.log($window.localStorage['currentUser'])
  if ($window.localStorage['currentUser']) {
    $http.defaults.headers.common["Authorization"] = "Token token=" + $window.localStorage['currentUser'];
    // $http.defaults.headers.common['Auth-Token'] = 'login YmVlcDpi';
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
    .state('tab.post-detail', {
      url: '/posts/:pId',
      views: {
        'tab-home': {
          templateUrl: 'templates/post-detail.html',
          controller: 'PostDetailCtrl'
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
