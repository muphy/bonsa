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

    $scope.$on('onLoginSuccess', function (event, authData) {
      console.log(authData); // 'Some data'
      $scope.closeLogin();
    });
    

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
    $scope.profileImg = function() {
      return UserService.getUserProfileImage();
    };

    $scope.hasSession = function() {
      return UserService.hasSession();
    }
});


