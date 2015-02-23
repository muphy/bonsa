angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, UserService) {
  // Logs a user in with inputted provider
  $scope.dologin = function(provider) {
    UserService.login(provider);
  };
  // Logs a user out
  $scope.logout = function() {
    UserService.logout();
  };

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
  $scope.login = function() {
    $scope.modal.show();
  };

})

.controller('RoomsCtrl', function($scope, $firebase, $http, $ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hide = function() {
    $ionicLoading.hide();
  };
  $scope.show();
  $http.get('https://sizzling-heat-271.firebaseio.com/rooms.json').
  success(function(data, status, headers, config) {
    var temp = [];
    for (var o in data) {
      // console.log(data[o]);
      temp.push(data[o]);
    }
    $scope.rooms = temp;
    $scope.hide();
  }).
  error(function(data, status, headers, config) {
    console.log('error');
    console.log(data);
    $scope.hide();
  });
})

.controller('Messages', function($scope, $timeout, $firebase, $ionicScrollDelegate, $stateParams,UserService) {

  console.log($stateParams.id);

  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  var roomId = $stateParams.id;
  var userId = UserService.userId;
  var userProfile = UserService.userProfile;
  var ref = new Firebase("https://sizzling-heat-271.firebaseio.com/messages/" + roomId).limitToLast(200); //.orderBy("timestamp").limitToLast(10);
  //    ref.orderByKey().on("child_added", function(snapshot) {
  //          console.log(snapshot.key());
  //        });
  var sync = $firebase(ref);
  $scope.myId = userId;
  $scope.messages = sync.$asArray();
  // download the data into a local object
  $scope.sendMessage = function() {
    var message = $scope.data.message;
    $scope.messages.$add({
      text: message,
      userId: userId,
      name: userProfile.name,
      picture: userProfile.picture.data.url
    }).then(function(newChildRef) {
      console.log("added record with id " + newChildRef.name());
    });
    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);
  }

  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);
  }
  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  }
  $scope.closeKeyboard = function() {
    cordova.plugins.Keyboard.close();
  }

});
