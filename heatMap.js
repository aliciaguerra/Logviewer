Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

// This is for Heat Map
logViewerApp.controller('heatMapCtrl', function ($scope, $rootScope, $http, $modal, $location, $interval, logViewerFactory) {

    var timerDefaultValue = 59;
    $scope.isLoading = false;

    $scope.environments = [
        { name: 'DEV' },
        { name: 'INT2' },
        { name: 'INT1' },
        { name: 'CAE' },
        { name: 'PROD' }
    ];

    $scope.$on("$locationChangeStart", function (event, next, current) {
        $rootScope.navigated = true;
        cancelTimers();
        var b = docCookies.hasItem('token');
        if (!b) {
            $location.url('/login');
        }
    });

    function cancelTimers()
    {
        $interval.cancel($scope.shopsTimer);
        $interval.cancel($scope.countDownTimer);
    }

    function startTimers()
    {
        $scope.shopsTimer = $interval($scope.refreshMarkers, $scope.countdown * 1000);
        $scope.countDownTimer = $interval($scope.countdownTick, 1000);
    }

    $scope.environment = $scope.environments[0]; //Default value is PROD

    $scope.changeEnv = function (env) {
        cancelTimers();
        $scope.countdown = timerDefaultValue;
        $scope.resetMap();
        restartTotals();
        refreshShops();
    };

    $scope.resetMap = function() {
        $scope.map.center = {
            latitude: 38.41080918589706,
            longitude: -96.23605468749997
        };
        $scope.map.zoom = 5;
        $scope.selectedMarker = { showWindow: true };
    }

    $scope.map = {
        center: {
            latitude: 38.41080918589706,
            longitude: -96.23605468749997
        },
        zoom: 5,
        selectedMarker: {
            showWindow: false
        },
        shops: [],
        options: {
            streetViewControl: false,

        }
    };

    $scope.init = function () {
        $scope.countdown = timerDefaultValue;
        $scope.totalShops = 0;
        restartTotals();
        refreshShops();
    };

    function restartTotals() {
        $scope.totalGreenShops = 0;
        $scope.totalYellowShops = 0;
        $scope.totalRedShops = 0;
        $scope.totalInactive = 0;
    }

    $scope.countdownTick = function () {
        $scope.countdown = $scope.countdown - 1;
    };

    $scope.refreshMarkers = function () {
        $scope.countdown = 0;
        cancelTimers();
        restartTotals();
        params = {
            offset: 1,
            env: $scope.environment.name
        };
        $scope.isLoading = true;
        logViewerFactory.GetRSShopTransaction(params, function (dataTrans, status) {
            if (status == 200) {
                $scope.map.shops = updateMarkers(dataTrans, $scope.map.shops);
                $scope.countdown = timerDefaultValue;
                startTimers(); // if getting transactions fails there is no point on getting the timers back 
            }
            $scope.isLoading = false;
        });
    }

    function refreshShops() {
        $scope.totalShops = 0;
        $scope.map.shops = [];
        var params = {
            env: $scope.environment.name
        };
        $scope.isLoading = true;
        logViewerFactory.GetShops(params, function (data, status) {
            if (status == 200) {
                params = {
                    offset: data.FirstLoadMin,
                    env: $scope.environment.name
                };
                logViewerFactory.GetRSShopTransaction(params, function (dataTrans, status) {
                    if (status == 200) {
                        $scope.map.shops = updateMarkers(dataTrans, data.Shops);
                        $scope.totalShops = data.Shops.length;
                        //Add close and click events to each marker
                        _.each($scope.map.shops, function (marker) {
                            marker.closeClick = function () {
                                marker.showWindow = false;
                                $scope.$apply();
                            };
                            marker.onClicked = function () {
                                onMarkerClicked(marker);
                            };
                        });
                    }
                    startTimers();
                    $scope.isLoading = false;
                });
            }
        });
    };

    function updateMarkers(dataTrans, dataShops) {
        _.each(dataShops, function (marker) {
            _.each(dataTrans.RSTransactionList, function (transaction) {                
                //Check if the current marker shop id is equal to the transaction shop id
                if (transaction.ShopMemberId == marker.MemberId) {
                    //update LastTransactionDateTime with the one coming from the server
                    marker.LastTransactionDateTime = transaction.Datetime;
                    marker.hasTransaction = true;
                }
            });
            if (!marker.hasTransaction) {
                marker.LastTransactionDateTime = "No transaction received in the last " + (dataTrans.RedThresholdMin / 60)+ " hours."
            }
            //lets see what color should we put (yellow or green)
            var hasGreen = false;
            var hasYellow = false;
            var serverDateTime = new Date(dataTrans.ServerDateTime);
            var transactionDateTime = new Date(marker.LastTransactionDateTime);
            var timeDiff = Math.abs(serverDateTime.getTime() - transactionDateTime.getTime());
            var diffMin = Math.ceil(timeDiff / (1000 * 60));
            if (diffMin < dataTrans.RedThresholdMin) {
                marker.icon = "images/pin_yellow.png";
                marker.hasTransaction = true;
                hasYellow = true;
                $scope.totalYellowShops++;
            }
            else {
                marker.hasTransaction = false;
            }
            if (diffMin < dataTrans.YellowThresholdMin) {
                $scope.totalGreenShops++;
                if (marker.hasTransaction === true) {
                    $scope.totalYellowShops--;
                    hasYellow = false;
                }
                else {
                    marker.hasTransaction = true;
                }
                marker.icon = "images/pin_green.png";
                hasGreen = true;
            }
            if (!marker.hasTransaction) {
                $scope.totalRedShops++;
                marker.icon = "images/pin_red.png";
            }
            if (!marker.Active) {
                $scope.totalInactive++;
                marker.icon = "images/pin_gray.png";
                if (hasYellow) {
                    $scope.totalYellowShops--;
                } else if (hasGreen) {
                    $scope.totalGreenShops--;
                } else {
                    $scope.totalRedShops--;
                }
            }
        });
        return dataShops;
    }

    var onMarkerClicked = function (marker) {
        marker.showWindow = true;
        $scope.map.selectedMarker = marker;
        $scope.$apply();
    };

    $scope.onMarkerClicked = onMarkerClicked;

    var closeClick = function () {
        $scope.map.selectedMarker.showWindow = false;
    };

    $scope.closeClick = closeClick;
});
