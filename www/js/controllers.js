angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $http, $state, $rootScope, Session, User, $ionicSlideBoxDelegate) {
  if ($window.localStorage.token) {
    $state.go('tab.home', {}, {reload: true})
  } else {
    $state.go('forms', {}, {reload: true})
  }
  $rootScope.currentUser = Boolean($window.localStorage.token)
  // Form data for the login modal
  $scope.logout = function() {
    $window.localStorage.token = ''
    $rootScope.currentUser = Boolean($window.localStorage.token)
    $http.defaults.headers.common['Authorization'] = ''
    // console.log($window.localStorage.token)
    $rootScope.loginErr = ''
    $rootScope.signupErr = ''
    $state.go('forms', {}, {reload: true})
  }

})

.controller('FormsCtrl', function($scope, $http, $state, $rootScope, $window, Session, User, Qiniu, $ionicModal, $timeout, $resource ,Countries) {
  $rootScope.$broadcast('qiniuUPdate')
  $scope.loginData = {email: "lg1@gmail.com", password: ""}
  $scope.signupData = {name:'lg1'}; $rootScope.loginErr = ''; $rootScope.signupErr = ''
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var sess = new Session($scope.loginData)
    sess.$save(function(data) {
      if (data.token) {
        $window.localStorage.token = data.token
        $rootScope.currentUser = Boolean($window.localStorage.token)
        $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
        // console.log($window.localStorage.token)
        $state.go('tab.home', {}, {reload: true})
      } else {
        // console.log(data.err)
        $rootScope.loginErr = data.err
      }
    })
  }
  $scope.countries = Countries.all()
  $ionicModal.fromTemplateUrl('templates/countries.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal   // modal.show()
  })
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  })
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  })
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  })
  $scope.signupData.nationality = "select country"
  $scope.setCtry = function(index) {
    $scope.signupData.nationality = $scope.countries[index].name
    $scope.modal.hide()
  }
  $scope.getFile = function(f) {
    $scope.temfile = f
  }
  $scope.avt = true
  $scope.doSignup = function() {
    if (!$scope.temfile) {$scope.avt = false; return}
    Qiniu.ngFileUp($scope.temfile).then(function (resp) {
      // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.key + JSON.stringify(resp.data))
      $scope.signupData.avatar = "http://7xj5ck.com1.z0.glb.clouddn.com/" + resp.data.key
      var user = new User({user:$scope.signupData})
      user.$save(function(data) {
        if (data.token) {
          $window.localStorage.token = data.token
          $rootScope.currentUser = Boolean($window.localStorage.token)
          $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
          // console.log($window.localStorage.token)
          $state.go('tab.home', {}, {reload: true})
        } else {
          // console.log(data.err)
          $rootScope.signupErr = data.err
        }
      })
    })
  }
  var Discover = $resource($rootScope.baseUrl + '/api/discoverposts/:id')
  $scope.posts = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    Discover.query({page: $scope.page, lastId: $scope.lastId})
    .$promise.then(function(data) {
      // console.log(JSON.stringify(data))
      $scope.posts = $scope.posts.concat(data)
      $scope.page += 1
      $scope.$broadcast('scroll.infiniteScrollComplete')
    })
  }
})

.controller('HomeCtrl', function($scope, $http, $state, $rootScope, $window, Post) {
  $scope.posts = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    if ($scope.dataLength == $scope.limit){
      Post.query({page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        // console.log(JSON.stringify(data))
        $scope.dataLength = data.length
        $scope.posts = $scope.posts.concat(data)
        //Stop the ion-refresher from spinning
        $scope.page += 1
        if (data.length == $scope.limit) {$scope.lastId = data[$scope.limit-1].id}
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
      // $scope.$broadcast('scroll.infiniteScrollComplete')
    }
  }

  $scope.doRefresh = function() {
    // $state.go('tab.home', null, {reload: true})
    // $window.location.reload(true)
    $state.go($state.current, {}, {reload: true})
    $scope.$broadcast('scroll.refreshComplete')
  }

})

.controller('WriteCtrl', function($scope, $http, $state,$ionicHistory, $rootScope, $resource, Post, Qiniu) {
  $rootScope.$broadcast('qiniuUPdate')
  var hiddenPo = $resource($rootScope.baseUrl + '/api/hiddenposts/:id')
  $scope.posts = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    if ($scope.dataLength == $scope.limit){
      hiddenPo.query({page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        // console.log(JSON.stringify(data))
        $scope.dataLength = data.length
        $scope.posts = $scope.posts.concat(data)
        //Stop the ion-refresher from spinning
        $scope.page += 1
        if (data.length == $scope.limit) {$scope.lastId = data[$scope.limit-1].id}
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
      // $scope.$broadcast('scroll.infiniteScrollComplete')
    }
  }
  $scope.loadMore()
  $scope.post = {content:''}; $scope.temfiles = []
  $scope.listFiles = function(f) {
    $scope.temfile = f; //$scope.temfiles.push(f) // console.log($scope.cafe.content)
  }
  $scope.refresh = function() {
    $state.go($state.current, {}, {reload: true})
  }
  $scope.audioPlay = function() {
    document.getElementById('audio').play()
  }
  $scope.sendPost = function() {
    // if (!$scope.temfile && !$scope.post.content){ $scope.empty = true ; return}
    if ($scope.temfile) {
      Qiniu.ngFileUp($scope.temfile).then(function (resp) {
        // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.key + JSON.stringify(resp.data))   // http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-28T06%3A11%3A25.113Z
        $scope.post.key = resp.data.key
        var post = new Post($scope.post) //{key: resp.data.key, content: $scope.content})
        post.$save(function(data) {
          $state.go('tab.home', {}, {reload: true})
        })
      }, function (resp) {
        $scope.status= resp.status; console.log('Error status: ' + resp.status)
      }, function (evt) {
        $scope.uppercent = parseInt(100.0 * evt.loaded / evt.total)
        // console.log('progress: ' + $scope.uppercent + '% ' + evt.config.data.file.name)
      })
    } else {
      var post = new Post($scope.post)
      post.$save(function(data) {
        if ($scope.post.hidden){
          $state.go($state.current, null, {reload: true})
        } else {
          $state.go('tab.home', null,{ reload: true})
        }
      })
    }
  }

})

.controller('AudioVideoCtrl', function($scope, $http, $state, $ionicHistory, $rootScope, $resource, Post, Qiniu) {
  $scope.post = {content:''}; $scope.temfiles = []
  $scope.refresh = function() {
    $state.go($state.current, {}, {reload: true})
  }
  $scope.audioPlay = function() {
    document.getElementById('audio').play()
      // document.getElementById('audio').src = $scope.temfile.src
  }
  $scope.onchangeUp = function(f) {
    console.log(f)
    // Qiniu.ngFileUp(f).then(function (resp) {
    //   $scope.url = "http://7xj5ck.com1.z0.glb.clouddn.com/" + resp.data.key
    //   document.getElementById('audio').src = $scope.url
    // }, function (resp) {
    //   console.log('Error status: ' + resp.status)
    // }, function (evt) {
    //   $scope.uppercent = parseInt(100.0 * evt.loaded / evt.total)
    // })
  }

})

.controller('UserIdCtrl', function($scope, $stateParams, $http, $state, $rootScope, $window, Post, Comment, User, Follow) {
  $scope.posts = []; $scope.isCurrentUser = true; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    if ($scope.dataLength == $scope.limit) {
      User.get({id: $stateParams.id, page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        // console.log(JSON.stringify(data))
        $scope.dataLength = data.posts.length
        if (  $scope.page == 0){
          $scope.user = data.user
          $scope.foing = data.foing
          if ($window.localStorage.token == data.user.password_digest) {
            $scope.isCurrentUser = true
          } else {
            $scope.isCurrentUser = false
          }
        }
        $scope.posts = $scope.posts.concat(data.posts)
        if (data.posts.length == $scope.limit) {$scope.lastId = data.posts[$scope.limit-1].id}
        $scope.page += 1
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
    }
  }

  $scope.follow = function() {
    var fo = new Follow({id: $stateParams.id})
    fo.$save(function(data) {
      // console.log(JSON.stringify(data))
      $scope.foing = !$scope.foing
    })
  }

  $scope.unfollow = function() {
    Follow.get({id: $stateParams.id})
    .$promise.then(function(data) {
      // console.log(JSON.stringify(data))
      $scope.foing = !$scope.foing
    })
  }
})


.controller('PostIdCtrl', function($scope, $stateParams, $http, $state, $rootScope, $window, $ionicHistory, Post, Comment) {
  $scope.comment = {"postId": $stateParams.id, "content":""}
  $scope.comments = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    if ($scope.dataLength == $scope.limit) {
      Post.get({id: $stateParams.id, page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        // console.log(JSON.stringify(data))
        $scope.dataLength = data.comments.length
        if ($scope.page == 0){ $scope.p = data.post }
        if (data.comments.length == $scope.limit) {$scope.lastId = data.comments[$scope.limit-1].id}
        $scope.comments = $scope.comments.concat(data.comments)
        $scope.page += 1
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
    }
  }
  $scope.loadMore()
  // $scope.loadMore()
  $scope.sendComment = function() {
    var comment = new Comment($scope.comment)
    comment.$save(function(data) {
      // console.log(JSON.stringify(data))
      $ionicHistory.clearCache().then(function(){
        $state.go($state.current, null, {reload: true})
      })
    })
  }
})

.controller('DiscoverCtrl', function($scope, $http, $rootScope, $state, $window, $resource, Post) {
  var Discover = $resource($rootScope.baseUrl + '/api/discoverposts/:id')
  $scope.posts = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    Discover.query({page: $scope.page, lastId: $scope.lastId})
    .$promise.then(function(data) {
      // console.log(JSON.stringify(data))
      $scope.posts = $scope.posts.concat(data)
      $scope.page += 1
      $scope.$broadcast('scroll.infiniteScrollComplete')
    })
  }

})

.controller('AccountCtrl', function($scope,$http,$cordovaCamera,$cordovaCapture) {
  $scope.settings = {
    enableFriends: true
  }

})

.controller('UserupCtrl', function($scope, $http, $state, $rootScope, $window, $resource, Qiniu, $ionicModal, $timeout, Countries) {
  $rootScope.$broadcast('qiniuUPdate'); $scope.userupData = {}
  var Userup =  $resource($rootScope.baseUrl + '/api/userup/:id')
  Userup.get({id:0}).$promise.then(function(data) {
    // console.log(JSON.stringify(data))
    $scope.userupData.name = data.user.name
    $scope.userupData.nationality = data.user.nationality
    $scope.userupData.email = data.user.email
    $scope.userupData.avatar = data.user.avatar
  })
  $scope.countries = Countries.all()
  $ionicModal.fromTemplateUrl('templates/countries.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal   // modal.show()
  })
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  })
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  })
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  })
  // $scope.userupData.nationality = "select country"
  $scope.setCtry = function(index) {
    $scope.userupData.nationality = $scope.countries[index].name
    $scope.modal.hide()
  }
  $scope.getFile = function(f) {
    $scope.temfile = f
  }
  $scope.avt = true
  $scope.doUserup = function() {
    // if (!$scope.temfile) {$scope.avt = false; return}
    if ($scope.temfile){
      Qiniu.ngFileUp($scope.temfile).then(function (resp) {
        $scope.userupData.avatar = "http://7xj5ck.com1.z0.glb.clouddn.com/" + resp.data.key
        var user = new Userup($scope.userupData)
        user.$save(function(data) {
          $state.go('tab.home', {}, {reload: true})
          // $window.location.reload()
        })
      })
    } else {
      var user = new Userup($scope.userupData)
      user.$save(function(data) {
        $state.go('tab.home', {}, {reload: true})
        // $window.location.reload()
      })
    }
  }

})

