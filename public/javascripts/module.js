var mainmodule = angular.module('iotfrontend', ['ngRoute', 'ngMaterial']);

mainmodule.controller('AppCtrl', function($scope) { 
});

mainmodule.config(
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/home',
                    controller: 'AppCtrl'
                })
            .otherwise({
                redirectTo: '/'
            });
        });

mainmodule.controller('ESPController', function($scope, $http) {
    var socket = io.connect();
    //var socket = io.connect('http://localhost:8000');
    var esps=new Array();
    $scope.esps = esps;
    socket.on('update', function (data) {
        console.log("received"); console.log(data);
        i = 0;
        len = (typeof($scope.devices)=="undefined"?0:$scope.devices.length);
        while ((i<len) && ($scope.devices[i]["macaddr"] != data["macaddr"])) i++;
        if (i<len) {
            // Update
            if (typeof(data["screenname"]) != "undefined")
                $scope.devices[i]["screenname"]=data["screenname"];
            $scope.devices[i]["value"]=data["values"][0];
        } else {
            // Create
            $scope.devices=[data];
        }
        console.log("$scope.devices"); console.log($scope.devices);
        $scope.$apply();
    });
    socket.on('values', function (data) {
        console.log("value "); console.log(data);
        esps[data["macaddr"]] = { macaddr: data["macaddr"], name: data["name"], value: data["value"] };
        esps.sort();
        console.log("esps"); console.log(esps);
        console.log("scope.esps"); console.log($scope.esps);
        $scope.esps = [];
        console.log("scope.esps"); console.log($scope.esps);
        $scope.devices.forEach(function(i){
            $scope.esps.push(esps[i]); 
        });
        console.log("scope.esps"); console.log($scope.esps);
        $scope.$apply();
    });
    socket.on('devices', function (data) {
        console.log("devices "); console.log(data);
        $scope.devices = data;
        $scope.$apply();
    });
    socket.on('registrations', function (data) {
        console.log("registrations "); console.log(data);
        len = $scope.devices.length;
        for (i = 0; i < len; i++) {
            if ($scope.devices[i] == data["macaddr"]) {
                $scope.devices[i] = data["value"]["firstname"];
            };
        };
        len = $scope.esps.length;
        for (i = 0; i < len; i++) {
            if ($scope.esps[i]["macaddr"] == data["macaddr"]) {
                $scope.esps[i]["macaddr"] = data["value"]["firstname"];
            };
        };
        $scope.$apply();
    });
});

