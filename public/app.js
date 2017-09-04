//-- author: david.maier@redislabs.com

//Local cache
var cache = {};

//Set of all MAC addresses
var macs = {};

//Helpers
function _isDefined(obj)
{
    if (typeof obj == 'undefined' || obj == 'undefined' || obj == null)
    {
        return false;
    }

    return true;
}

function _initArr(n) {

  empty = [];
	
  for (var i = 1; i <= n; i++) {
  	empty.push("");
  }

  return empty;
}


//Google Charts
google.load('visualization', '1', {
  packages: ['corechart']
});

google.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['iotDemo']);
});

// Define the module
var myApp = angular.module('iotDemo', []);

// Define the controller
myApp.controller('ValuesController', [ '$scope', '$window', function ValuesController($scope, $window) {
	
	var socket = $window.io.connect('http://localhost:3000');
	socket.on('update', function (data) {
    	
		if ( !_isDefined(data["macaddr"] )) return;
		//console.log(data);

		var mac = data.macaddr;

		//Mimic a set
		macs[mac] = mac;		


		//Init Cache
		if ( !_isDefined(cache[mac] )) {
			cache[mac] = _initArr(100);
			cache['count::' + mac] = 0;
			cache['last::' + mac] = "";
			
			if (_isDefined(data.screenname)) {
			  cache['name::' + mac] = data.screenname;
			}
			else {
			  cache['name::' + mac] = mac;
			}
		}
		
		//Cache the last 100 items
		last = data.values[0];
		var count = cache['count::' + mac];
		
		cache['last::' + mac] = last;
		cache[mac][count] = last;

		count = count + 1;
		//Round Robin
		//if (count == cache[mac].length-1) count = 0;
		
		//Shifting
		if (count == cache[mac].length-1) {
		
			cache[mac].shift();
			cache[mac].push("");
			count = count - 1;
		}

		cache['count::' + mac] = count;

		//Set the model
		$scope.items = cache;
		$scope.macs = Object.values(macs);
		$scope.$apply();
		

		//Data to draw
		var chart_data = [];
		chart_data.push(['Item', 'Value']);
		var values = cache[mac];

		for (var i in values) {
  			chart_data.push([ i , parseInt(values[i])]);
		}			
		

		//Draw chart
		var data = google.visualization.arrayToDataTable(chart_data);
      		
		var color = 'red'

		var options = {
			colors: [color],
        		title: 'Last 100 items'
      		};
      		
		var chart = new $window.google.visualization.LineChart(document.getElementById(mac));
      		//TODO: Draw dependent on property 'hidden'
        //chart.draw(data, options);
  	});
}]);

