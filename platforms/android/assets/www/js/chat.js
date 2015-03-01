  // All this does is allow the message 
  // to be sent when you tap return
  App.controller('Messages', function($scope, $timeout, $firebase, $ionicScrollDelegate, $stateParams, UserService) {

      console.log($stateParams.id);

      var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

      var roomId = $stateParams.id;
      var userId = UserService.userId;
      var userProfile = UserService.userProfile;
      var ref = new Firebase("https://sizzling-heat-271.firebaseio.com/messages/" + roomId).limitToLast(200); //.orderBy("timestamp").limitToLast(10);
      //    ref.orderByKey().on("child_added", function(snapshot) {
      //          console.log(snapshot.key());
      //        });
      $ionicScrollDelegate.scrollBottom(true);
      var sync = $firebase(ref);
      $scope.myId = userId;
      $scope.messages = sync.$asArray();
      // download the data into a local object
      $scope.sendMessage = function() {
          console.log(userProfile);
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
