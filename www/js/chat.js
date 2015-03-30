  // All this does is allow the message 
  // to be sent when you tap return
App.directive('input', function($timeout) {
          return {
              restrict: 'E',
              scope: {
                  returnClose: '=',
                  onReturn: '&',
                  onFocus: '&',
                  onBlur: '&'
              },
              link: function(scope, element, attr) {
                  element.bind('focus', function(e) {
                      if (scope.onFocus) {
                          $timeout(function() {
                              scope.onFocus();
                          });
                      }
                  });
                  element.bind('blur', function(e) {
                      if (scope.onBlur) {
                          $timeout(function() {
                              scope.onBlur();
                          });
                      }
                  });
                  element.bind('keydown', function(e) {
                      if (e.which == 13) {
                          if (scope.returnClose) element[0].blur();
                          if (scope.onReturn) {
                              $timeout(function() {
                                  scope.onReturn();
                              });
                          }
                      }
                  });
              }
          }
      })
      .directive('userIcon', function() {
          return {
              restrict: 'E',
              template: '<div class="photo icon"></div>',
              replace: true,
              link: function(scope, element, attr) {
                  var imageUrl = scope.message.picture;
                  element.css('background-image', 'url(' + imageUrl + ')');
              }
          }
      });


  App.controller('Messages', function($scope, $timeout, $firebase, $ionicScrollDelegate, $stateParams, UserService,RoomService,$ionicModal) {

      console.log($stateParams.id);

      var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

      var roomId = $stateParams.id;
      $scope.title = RoomService.findRoomById(roomId).title;
      var userId = UserService.getUserId();
      var ref = new Firebase("https://sizzling-heat-271.firebaseio.com/messages/" + roomId).limitToLast(200); //.orderBy("timestamp").limitToLast(10);
      //    ref.orderByKey().on("child_added", function(snapshot) {
      //          console.log(snapshot.key());
      //        });
      var sync = $firebase(ref);
      $scope.myId = userId;
      $scope.messages = sync.$asArray();
      $scope.messages.$watch(function(event) {
        var eventName = event.event;
        if(eventName === 'child_added') {
          $ionicScrollDelegate.scrollBottom(true);
        }
      });
      // download the data into a local object
      $scope.sendMessage = function() {
          if(!$scope.data) return;
          var message = $scope.data.message;
          var userProfile = UserService.getUserProfile();
          var userId = UserService.getUserId();
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

      $scope.checkSession = function() {
        // UserService.onLoginSuccess = function(authData) {
        //   $scope.modal.hide();
        // };
        // if(UserService.hasSession()) {

        // } else {
        //   $scope.modal.show();
        // }
        return true;
      };

      $scope.inputUp = function() {
          if (isIOS) $scope.data.keyboardHeight = 216;
          $timeout(function() {
              $ionicScrollDelegate.scrollBottom(true);
          }, 300);
      };
      $scope.inputDown = function() {
          if (isIOS) $scope.data.keyboardHeight = 0;
          $ionicScrollDelegate.resize();
      };
      $scope.closeKeyboard = function() {
          cordova.plugins.Keyboard.close();
      };

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
  });
