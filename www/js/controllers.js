angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $http, $state, $rootScope, Session) {
  // Form data for the login modal
  $scope.loginData = {email: "gongsongping@gmail.com", password: "gsp191954"};
  $scope.currentUser = $window.localStorage['currentUser']
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    if (Boolean($window.localStorage['currentUser']) === false) {
      modal.show()
    }
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // Open the login modal
  $scope.showLoginForm = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var sess = new Session($scope.loginData);
    sess.$save(function(data) {
      $window.localStorage['currentUser'] = data.remId;
      $scope.currentUser = $window.localStorage['currentUser']
      $http.defaults.headers.common['Authorization'] = "Token token=" + data.remId
      console.log($window.localStorage['currentUser']);
    });

    $timeout(function() {
      $scope.closeLogin();
    }, 1000);

  };
  $scope.logout = function() {
    $window.localStorage['currentUser'] = '';
    $scope.currentUser = $window.localStorage['currentUser']
    $http.defaults.headers.common['Authorization'] = ''
    console.log($window.localStorage['currentUser']);
    // window.location.reload()
    // $window.location.reload(true);
    // $state.go($state.current, {}, {reload: true});
    $state.go('tab.account', {}, {reload: true});
  };
})

.controller('HomeCtrl', function($scope, $http, $state, $rootScope, Post) {
  $scope.booLn = function(val) {
    if (val === 'null'){
      return false
    } else {
      return true
    }
  }

  $scope.posts = Post.query();

})

.controller('WriteCtrl', function($scope, $http, Qiniu, $state, $rootScope, Post) {
  Qiniu.qiniu();
  $scope.post = {};
  $scope.sendPost = function() {
    var post = new Post($scope.post);
    post.$save(function(data) {
      $state.go('tab.home', {}, {reload: true});
    });
  }

})

.controller('UserIdCtrl', function($scope, $stateParams, $http, $state, $rootScope, Post, Comment,User) {
  $scope.data = User.get({id: $stateParams.uId})
  // User.get({id: $stateParams.uId})
  // .$promise.then(function(data) {
  //   $scope.data = data;
  //   console.log($scope.data);
  // });

})


.controller('PostIdCtrl', function($scope, $stateParams, $http, $state, $rootScope, Post, Comment) {
  $scope.comment = {"postId": $stateParams.pId, "content":""}
  // $scope.post =   Post.get({id: $stateParams.pId})
  Post.get({id: $stateParams.pId})
  .$promise.then(function(data) {
    $scope.data = data;
    console.log($scope.data);
  });

  $scope.sendComment = function() {
    var comment = new Comment($scope.comment);
    comment.$save(function(data) {
      console.log(JSON.stringify(data))
      $state.go($state.current, {}, {reload: true});
    });
  }

})


.controller('CrosslangCtrl', function($scope, $http, $rootScope) {


})

.controller('AccountCtrl', function($scope,$http) {
  $scope.settings = {
    enableFriends: true
  }

})


// var req = {
//    method: 'POST',
//    url: $rootScope.baseUrl + "/api/session",
//    headers: {
//      'Accept': "application/json",
//      'Content-Type': "application/json; charset=utf-8"
//    },
//    data: $scope.loginData
// }
// $http(req)
// .success(function(data, status, headers, config){
//   // alert(JSON.stringify(data))
//   // alert(JSON.stringify(headers()))
//   $window.localStorage['currentUser'] = data.remId;
//   $scope.currentUser = $window.localStorage['currentUser']
//   $http.defaults.headers.common['Authorization'] = "Token token=" + data.remId
//   console.log($window.localStorage['currentUser']);
//   // window.location.reload()
// })
// .error(function(data, status, headers, config){
//   // alert(JSON.stringify(headers()))
//   alert("failed")
// })
// Simulate a login delay. Remove this and replace with your login
// code if using a login system

// $http.get($rootScope.baseUrl + "/api/posts")
// .success(function(data, status, headers, config){
//     // alert(JSON.stringify(data))
//     // alert(JSON.stringify(headers()))
//   $scope.posts = data;
// })
// .error(function(data, status, headers, config){
//   alert(JSON.stringify(headers()))
// })

//   var req = {
//      method: 'POST',
//      url: $rootScope.baseUrl + "/api/posts",
//      headers: {
//        'Accept': "application/json",
//        'Content-Type': "application/json; charset=utf-8"
//      },
//     //  data: {"content": $scope.post.content,"hidepo": $scope.post.hidepo, "file": idata}
//     data: $scope.post
//   }
//   $http(req)
//   .success(function(data, status, headers, config){
//     // alert(JSON.stringify(data))
//     // alert(JSON.stringify(headers()))
//     // $state.go($state.current, {}, {reload: true});
//     $state.go('tab.home', {}, {reload: true});
//
//   })
//   .error(function(data, status, headers, config){
//     // alert(JSON.stringify(headers()))
//     alert("failed")
//   })
//
// }

// $http.get($rootScope.baseUrl + "/api/posts/"+$stateParams.pId)
// .success(function(data, status, headers, config){
//     // alert(JSON.stringify(data))
//     // alert(JSON.stringify(headers()))
//   console.log(JSON.stringify(data))
//   $scope.post = data;
//
// })
// .error(function(data, status, headers, config){
//   alert(JSON.stringify(headers()))
// })

// var req = {
//    method: 'POST',
//    url: $rootScope.baseUrl + "/api/comments",
//    headers: {
//      'Accept': "application/json",
//      'Content-Type': "application/json; charset=utf-8"
//    },
//    data: $scope.comment
// }
// $http(req)
// .success(function(data, status, headers, config){
//   // alert(JSON.stringify(data))
//   // alert(JSON.stringify(headers()))
//   console.log(JSON.stringify(data))
//   $state.go($state.current, {}, {reload: true});
// })
// .error(function(data, status, headers, config){
//   // alert(JSON.stringify(headers()))
//   alert("failed")
// })
