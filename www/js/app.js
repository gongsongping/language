// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js ,'ngIOS9UIWebViewPatch'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.directives','ngResource','ngCordova','ngFileUpload']) //'firebase',

.run(function($ionicPlatform, $http, $window, $rootScope, $state, $resource) {
  // $rootScope.baseUrl = "http://localhost:3000"
  //  $rootScope.baseUrl = "http://162.243.143.15"
   $rootScope.baseUrl = "http://changiif.com"
   $rootScope.$on('qiniuUPdate', function() {
     $resource('http://changiif.com/uptoken').get().$promise.then(function(data) {
       $window.localStorage.qiniuToken = data.uptoken
       // console.log('qiniuT  ' + $window.localStorage.qiniuToken)
     })
   })
   $rootScope.$broadcast('qiniuUPdate')
  if ($window.localStorage.token) {
    $http.defaults.headers.common["Authorization"] = "Token token=" + $window.localStorage.token
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault()
    }
    $rootScope.deviceInformation = ionic.Platform.device();
    $rootScope.isWebView = ionic.Platform.isWebView();
    $rootScope.isIPad = ionic.Platform.isIPad();
    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.isAndroid = ionic.Platform.isAndroid();
    $rootScope.isWindowsPhone = ionic.Platform.isWindowsPhone();
    $rootScope.currentPlatform = ionic.Platform.platform();
    $rootScope.currentPlatformVersion = ionic.Platform.version();
    // console.log(JSON.stringify($rootScope.deviceInformation) + $rootScope.isWebView + $rootScope.isIPad + $rootScope.isIOS + $rootScope.isAndroid + $rootScope.currentPlatform + $rootScope.currentPlatformVersion);
    if ($rootScope.isIOS || $rootScope.isAndroid || $rootScope.isWindowsPhone) {
      $rootScope.isMobile = true; $rootScope.isDT = false
    } else {
      $rootScope.isMobile = false; $rootScope.isDT = true
    }
  })
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider,$ionicConfigProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  // RestangularProvider.setBaseUrl("http://162.243.143.15/api")
  // RestangularProvider.setBaseUrl("http://localhost:3000/api")
  $ionicConfigProvider.tabs.position("bottom") //Places them at the bottom for all OS
  $ionicConfigProvider.views.swipeBackEnabled(false)
  // $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
  $stateProvider
  // setup an abstract state for the tabs directive

  .state('forms', {
    url: "/forms",
    // cache: false,
    views: {
      '@': {
        templateUrl: 'templates/forms.html',
        controller: 'FormsCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    // cache: false,
    views: {
      '@': {
        templateUrl: 'templates/form-login.html',
        controller: 'FormsCtrl'
      }
    }
  })

  .state('signup', {
    url: '/signup',
    // cache: false,
    views: {
      '@': {
        templateUrl: 'templates/form-signup.html',
        controller: 'FormsCtrl'
      }
    }
  })

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

  .state('tab.home-user-id', {
    url: '/home/users/:id',
    // cache: false,
    views: {
      'tab-home': {
        templateUrl: 'templates/home-user-id.html',
        controller: 'UserIdCtrl'
      }
    }
  })

  .state('tab.home-post-id', {
    url: '/home/posts/:id',
    cache: false,
    views: {
      'tab-home': {
        templateUrl: 'templates/home-post-id.html',
        controller: 'PostIdCtrl'
      }
    }
  })

  .state('tab.write', {
    url: '/write',
    cache: false,
    views: {
      'tab-write': {
        templateUrl: 'templates/tab-write.html',
        controller: 'WriteCtrl'
      }
    }
  })
  .state('tab.write-audiovideo', {
    url: '/write/audiovideo',
    cache: false,
    views: {
      'tab-write': {
        templateUrl: 'templates/audiovideo.html',
        controller: 'AudioVideoCtrl'
      }
    }
  })
  .state('tab.discover', {
    url: '/discover',
    // cache: false,
    views: {
      'tab-discover': {
        templateUrl: 'templates/tab-discover.html',
        controller: 'DiscoverCtrl'
      }
    }
  })

  .state('tab.discover-user-id', {
    url: '/discover/users/:id',
    // cache: false,
    views: {
      'tab-discover': {
        templateUrl: 'templates/discover-user-id.html',
        controller: 'UserIdCtrl'
      }
    }
  })

  .state('tab.discover-post-id', {
    url: '/discover/posts/:id',
    cache: false,
    views: {
      'tab-discover': {
        templateUrl: 'templates/discover-post-id.html',
        controller: 'PostIdCtrl'
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
  })

  .state('tab.account-userup', {
    url: '/account/userup',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/account-userup.html',
        controller: 'UserupCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});

// .state('tab.message', {
//   url: '/message',
//   abstract: true,
//   views: {
//     'tab-message': {
//       templateUrl: 'templates/tab-message.html',
//       controller: 'MessageCtrl'
//     }
//   }
// })
// .state('tab.message.mes1', {
//   url: '/mes1',
//   views: {
//     'message-mes@tab.message': {
//       templateUrl: 'templates/mes1.html'
//     }
//   }
// })
// .state('tab.message.mes2', {
//   url: '/mes2',
//   views: {
//     'message-mes@tab.message': {
//       templateUrl: 'templates/mes2.html'
//     }
//   }
// })

// .state('forms', {
//   url: "/forms",
//   // cache: false,
//   // abstract: true,
//   // templateUrl: "templates/forms-slide.html",
//   templateUrl: "templates/forms.html",
//   controller: 'AppCtrl'
// })
// .state('forms.login', {
//   url: '/login',
//   cache: false,
//   views: {
//     'form-login': {
//       templateUrl: 'templates/form-login.html'
//     }
//   }
// })
// .state('forms.signup', {
//   url: '/signup',
//   cache: false,
//   views: {
//     'form-signup': {
//       templateUrl: 'templates/form-signup.html'
//       // controller: 'ChangeCtrl'
//     }
//   }
// })
