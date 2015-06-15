angular.module('starter.controllers', ['ngCordova','ngFileUpload'])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $http, $state, $rootScope) {
  // Form data for the login modal
  $scope.loginData = {email: "gongsongping@gmail.com", password: "gsp191954"};
  $scope.currentUser = $window.localStorage['currentUser']
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // Open the login modal
  $scope.showLoginForm = function() {
    $scope.modal.show();
  };
  $scope.init = function() {
    if ($window.localStorage['currentUser']==="") {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        modal.show();
      });
    }
  }()
  // $scope.init();
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
      $window.localStorage['currentUser'] = $scope.loginData.email;
      $scope.currentUser = $window.localStorage['currentUser']
      $http.defaults.headers.common['Authorization'] = "Token token=" + $scope.loginData.email
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

.controller('HomeCtrl', function($scope, Chats, $http, $state,$rootScope ,Upload) {
  $scope.post = {"content":"."}
  $scope.files = []
  $scope.booLn = function(val) {
    if (val === 'null'){
      return false
    } else {
      return true
    }
  }
  $http.get($rootScope.baseUrl + "/api/home")
  .success(function(data, status, headers, config){
      // alert(JSON.stringify(data))
      // alert(JSON.stringify(headers()))
    $scope.posts = data;
  })
  .error(function(data, status, headers, config){
    alert(JSON.stringify(headers()))
  })
  $scope.makePost = function() {
    //Take the first selected file
    var idata = document.getElementById('img').src
    // var imgRaw = document.getElementById("imgInput").input.files

    var req = {
       method: 'POST',
       url: $rootScope.baseUrl + "/api/microposts/create",
       headers: {
         'Accept': "application/json",
         'Content-Type': "application/json; charset=utf-8"
       },
       data: {"content": $scope.post.content,"hidepo": $scope.post.hidepo, "file": idata}
      }
    $http(req)
    .success(function(data, status, headers, config){
      // alert(JSON.stringify(data))
      // alert(JSON.stringify(headers()))
      $state.go($state.current, {}, {reload: true});
    })
    .error(function(data, status, headers, config){
      // alert(JSON.stringify(headers()))
      alert("failed")
    })

  }

  $scope.keepFile = function (files) {
    // $scope.images = files
    // var img = imageToDataUri(files[0], 30, 30)
    // console.log(img)
    // console.log(img.src)
  }

  // $scope.$watch('files', function () {
  //       $scope.upload($scope.files);
  //   });
  $scope.upload = function (files) {
      if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
              var file = files[i];
              Upload.upload({
                  url: $rootScope.baseUrl + "/api/microposts/create",
                  headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json; charset=utf-8"
                  },
                  fields: {'content': $scope.post.content, 'hidepo': $scope.post.hidepo },
                  file: file
              }).progress(function (evt) {
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
              }).success(function (data, status, headers, config) {
                  console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                  $state.go($state.current, {}, {reload: true});
              });
          }
      }
  };

})

.controller('PostDetailCtrl', function($scope, $stateParams, Chats,$http, $state, $rootScope) {
  // $scope.chat = Chats.get($stateParams.chatId);
  // $scope.post = {}
  $scope.comment = {"micropost_id": $stateParams.pId, "content":""}
  $http.get($rootScope.baseUrl + "/api/microposts/"+$stateParams.pId)
  .success(function(data, status, headers, config){
      // alert(JSON.stringify(data))
      // alert(JSON.stringify(headers()))
    console.log(JSON.stringify(data))
    $scope.post = data;
    if (data.picture.url)
    {
      $scope.showPic = true
    }else {
      $scope.showPic = false
    }
  })
  .error(function(data, status, headers, config){
    alert(JSON.stringify(headers()))
  })
  $scope.makeComment = function() {
    var req = {
       method: 'POST',
      //  url: $rootScope.baseUrl + "/api/comments/create",
       url: $rootScope.baseUrl + "/sinatra/comment_create",
       headers: {
         'Accept': "application/json",
         'Content-Type': "application/json; charset=utf-8"
       },
       data: {"comment": $scope.comment}//{"content":"dee"}}
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

.controller('DashCtrl', function($scope,$http) {

})
.controller('CrosslangCtrl', function($scope, $http, $rootScope) {
  $http.get($rootScope.baseUrl + "/api/microposts/1")
  .success(function(data, status, headers, config){
      // alert(JSON.stringify(headers()))
    $scope.post = data;
  })
  .error(function(data, status, headers, config){
    alert(JSON.stringify(headers()))
  })
})

.controller('AccountCtrl', function($scope,$http,Chats) {
  $scope.settings = {
    enableFriends: true
  }
  $('#container').append('test');
  // $();
  Chats.qiniu();


})
