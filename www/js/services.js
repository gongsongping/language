angular.module('starter.services', [])

.factory('User', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/users/:id');
})

.factory('Follow', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/follow/:id');
})

.factory('Post', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/posts/:id');
})

.factory('Comment', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/comments/:id');
})

.factory('Session', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/session/:id');
})

.factory('Qiniu', function($window, $http ,Upload) {
  return {
    ngFileUp: function(f) {
      return Upload.upload({
        url: "http://upload.qiniu.com",
        data: {file: f, key: new Date(), token: $window.localStorage.qiniuToken}
      })
    }
  }
})
