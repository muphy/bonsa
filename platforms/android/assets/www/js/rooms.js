 App.controller('RoomsCtrl', function($scope, $firebase, $http, $ionicLoading,RoomService) {

    $scope.show = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };
    $scope.hide = function() {
        $ionicLoading.hide();
    };
    $scope.title = "프로그램";
    $scope.show();
    $scope.rooms = RoomService.fetchRooms();
    $scope.hide();
});