angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $http, $state, $rootScope) {
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
    var req = {
       method: 'POST',
       url: $rootScope.baseUrl + "/api/signin",
       headers: {
         'Accept': "application/json",
         'Content-Type': "application/json; charset=utf-8"
       },
       data: $scope.loginData
    }
    $http(req)
    .success(function(data, status, headers, config){
      // alert(JSON.stringify(data))
      // alert(JSON.stringify(headers()))
      $window.localStorage['currentUser'] = data.remId;
      $scope.currentUser = $window.localStorage['currentUser']
      $http.defaults.headers.common['Authorization'] = "Token token=" + data.remId
      console.log($window.localStorage['currentUser']);
      // window.location.reload()
    })
    .error(function(data, status, headers, config){
      // alert(JSON.stringify(headers()))
      alert("failed")
    })
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
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

.controller('HomeCtrl', function($scope, $http, $state, $rootScope) {
  $scope.booLn = function(val) {
    if (val === 'null'){
      return false
    } else {
      return true
    }
  }
  $http.get($rootScope.baseUrl + "/api/posts")
  .success(function(data, status, headers, config){
      // alert(JSON.stringify(data))
      // alert(JSON.stringify(headers()))
    $scope.posts = data;
  })
  .error(function(data, status, headers, config){
    alert(JSON.stringify(headers()))
  })

})

.controller('WriteCtrl', function($scope, $http, Qiniu, $state, $rootScope) {
  Qiniu.qiniu();
  $scope.post = {};
  $scope.sendPost = function() {
    //Take the first selected file
    // var idata = document.getElementById('img').src
    // var imgRaw = document.getElementById("imgInput").input.files
    var req = {
       method: 'POST',
       url: $rootScope.baseUrl + "/api/posts",
       headers: {
         'Accept': "application/json",
         'Content-Type': "application/json; charset=utf-8"
       },
      //  data: {"content": $scope.post.content,"hidepo": $scope.post.hidepo, "file": idata}
      data: $scope.post
    }
    $http(req)
    .success(function(data, status, headers, config){
      // alert(JSON.stringify(data))
      // alert(JSON.stringify(headers()))
      // $state.go($state.current, {}, {reload: true});
      $state.go('tab.home', {}, {reload: true});

    })
    .error(function(data, status, headers, config){
      // alert(JSON.stringify(headers()))
      alert("failed")
    })

  }

})

.controller('PostDetailCtrl', function($scope, $stateParams, $http, $state, $rootScope) {
  // $scope.chat = Chats.get($stateParams.chatId);
  // $scope.post = {}
  $scope.comment = {"postId": $stateParams.pId, "content":""}
  $http.get($rootScope.baseUrl + "/api/posts/"+$stateParams.pId)
  .success(function(data, status, headers, config){
      // alert(JSON.stringify(data))
      // alert(JSON.stringify(headers()))
    console.log(JSON.stringify(data))
    $scope.post = data;

  })
  .error(function(data, status, headers, config){
    alert(JSON.stringify(headers()))
  })

  $scope.sendComment = function() {
    var req = {
       method: 'POST',
       url: $rootScope.baseUrl + "/api/comments",
       headers: {
         'Accept': "application/json",
         'Content-Type': "application/json; charset=utf-8"
       },
       data: $scope.comment
      }
    $http(req)
    .success(function(data, status, headers, config){
      // alert(JSON.stringify(data))
      // alert(JSON.stringify(headers()))
      console.log(JSON.stringify(data))
      $state.go($state.current, {}, {reload: true});
    })
    .error(function(data, status, headers, config){
      // alert(JSON.stringify(headers()))
      alert("failed")
    })
  }
})


.controller('CrosslangCtrl', function($scope, $http, $rootScope) {


})

.controller('AccountCtrl', function($scope,$http) {
  $scope.settings = {
    enableFriends: true
  }

})
