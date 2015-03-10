 App.controller('RoomsCtrl', function($scope, $firebase, $http, $ionicLoading,UserService) {

    $scope.show = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };
    $scope.hide = function() {
        $ionicLoading.hide();
    };
    $scope.title = "대화방";
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
        console.log('fetches rooms list.')
    }).
    error(function(data, status, headers, config) {
        console.log('error');
        console.log(data);
        $scope.hide();
    });
});