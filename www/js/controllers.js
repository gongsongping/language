angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $http, $state, $rootScope, Session, User) {
  // Form data for the login modal
  $scope.loginData = {email: "gongsongping@gmail.com", password: "gsp191954"}
  $scope.currentUser = Boolean($window.localStorage['currentUser'])
  $scope.signUpData = {name:'gsp'}
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
    if (Boolean($window.localStorage['currentUser']) === false) {
      modal.show()
    }
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide()
  };
  // Open the login modal
  $scope.showLoginForm = function() {
    $scope.modal.show()
  };
  $scope.err = ''
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var sess = new Session($scope.loginData);
    sess.$save(function(data) {
      console.log(data.token)
      // console.log(err);
      if (data.token) {
        $window.localStorage['currentUser'] = data.token
        $scope.currentUser = Boolean($window.localStorage['currentUser'])
        $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
        console.log($window.localStorage['currentUser']);
        $scope.closeLogin();
        $state.go('tab.home', {}, {reload: true})
      } else {
        // $scope.modal.show();
        console.log(data.err);
        $scope.err = data.err
        $scope.showLoginForm()
      }
    });
    //
    // $timeout(function() {
    //   $scope.closeLogin();
    // }, 1000);
  };
  $scope.logout = function() {
    $window.localStorage['currentUser'] = ''
    $scope.currentUser = Boolean($window.localStorage['currentUser'])
    $http.defaults.headers.common['Authorization'] = ''
    console.log($window.localStorage['currentUser'])
    $scope.err = ''
    // window.location.reload()
    // $window.location.reload(true);
    // $state.go($state.current, {}, {reload: true});
    // $state.go('tab.account', {}, {reload: true});
    $scope.showLoginForm()
  };

  $scope.doSignUp = function() {
    var user = new User($scope.signUpData)
    user.$save(function(data) {
      console.log(data.token)
      // console.log(err);
      if (data.token) {
        $window.localStorage['currentUser'] = data.token
        $scope.currentUser = Boolean($window.localStorage['currentUser'])
        $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
        console.log($window.localStorage['currentUser'])
        $scope.closeLogin()
        $state.go('tab.home', {}, {reload: true})
      } else {
        // $scope.modal.show()
        console.log(data.err)
        $scope.err = data.err
        $scope.showLoginForm()
      }
    });
  }
})

.controller('HomeCtrl', function($scope, $http, $state, $rootScope, Post) {

  $scope.posts = Post.query()

})

.controller('WriteCtrl', function($scope, $http, Qiniu, $state, $rootScope, Post) {
  Qiniu.qiniu()
  $scope.post = {}
  $scope.sendPost = function() {
    var post = new Post($scope.post)
    post.$save(function(data) {
      $state.go('tab.home', {}, {reload: true})
    });
  }
})

.controller('UserIdCtrl', function($scope, $stateParams, $http, $state, $rootScope, $window, Post, Comment, User, Follow) {
  // $scope.user = User.get({id: $stateParams.uId})
  User.get({id: $stateParams.id})
  .$promise.then(function(data) {
    $scope.user = data.user
    // $scope.posts = data.posts
    $scope.foing = data.foing
    if ($window.localStorage['currentUser'] == data.user.password) {
      $scope.isCurrentUser = true
    } else {
      $scope.isCurrentUser = false
    }
    console.log(data.foing)
  })

  $scope.follow = function() {
    var fo = new Follow({id: $stateParams.id})
    fo.$save(function(data) {
      console.log(JSON.stringify(data))
      $scope.foing = !$scope.foing
    })
  }

  $scope.unfollow = function() {
    Follow.get({id: $stateParams.id})
    .$promise.then(function(data) {
      console.log(JSON.stringify(data))
      $scope.foing = !$scope.foing
    })
  }

})


.controller('PostIdCtrl', function($scope, $stateParams, $http, $state, $rootScope, Post, Comment) {
  $scope.comment = {"postId": $stateParams.id, "content":""}
  // $scope.post =   Post.get({id: $stateParams.pId})
  Post.get({id: $stateParams.id})
  .$promise.then(function(data) {
    $scope.post = data
    // $scope.comments = data.comments
    // console.log($scope.data);
  });

  $scope.sendComment = function() {
    var comment = new Comment($scope.comment);
    comment.$save(function(data) {
      console.log(JSON.stringify(data))
      $state.go($state.current, {}, {reload: true});
    });
  }

})


.controller('CrosslangCtrl', function($scope, $http, $rootScope, Items) {
  $scope.items = Items
  $scope.addItem = function() {
    var name = prompt("What do you need to buy?");
    if (name) {
      $scope.items.$add({
        "name": name
      })
    }
  }

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
