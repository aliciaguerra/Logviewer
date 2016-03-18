var logViewerApp = new angular.module('logViewerApp', ['ui.bootstrap', 'ngRoute', "highcharts-ng", 'angular-intro', 'google-maps']);

logViewerApp.directive('viewerMenu', function () {
    return {
        restrict: 'A',
        templateUrl: 'views/menu.html',
        scope: {

        },
        link: function (scope, elem, attrs) {

        }
    }
});
logViewerApp.directive('loadImage', function ($filter) {
    return {
        restrict: 'EA',
        template: '<div class="load-image-wrap">' +
            '<img src="{{imgSrc}}" ng-hide="loading" />' +
            '<p ng-show="loading" class="spinnerSmallCenter" ></p></div>',
        scope: {
            imgSrc: '@', //path of the image path to load
            fallbackSrc: '@' //path of the fallback image loacation
        },
        replace: true,
        link: function (scope, el, attrs) {
            scope.loading = true;

            function stopLoading() {
                scope.loading = false;
                scope.$digest();
            }

            angular.element(el.children()[0]).bind("load", function (event) {
                stopLoading();
            });

            angular.element(el.children()[0]).bind("error", function () {
                stopLoading();
                if (angular.isString(scope.fallbackSrc)) {
                    el.children()[0].src = scope.fallbackSrc;
                }
            });
        }
    }
});

logViewerApp.config(function ($routeProvider) {
    $routeProvider.when("/logs", { controller: "logViewerCtrl", templateUrl: "views/logviewer.html" });
    $routeProvider.when("/transactions", { controller: "mainCtrl", templateUrl: "views/transaction.html" });
    $routeProvider.when("/heatMap", { controller: "heatMapCtrl", templateUrl: "views/heatMap.html" });
    $routeProvider.when("/login", { controller: "loginCtrl", templateUrl: "views/login.html" });
    $routeProvider.when("/stats", { controller: "statsCtrl", templateUrl: "views/stats.html" });
    $routeProvider.when("/about", { controller: "loginCtrl", templateUrl: "views/about.html" });
    $routeProvider.when("/help", { controller: "loginCtrl", templateUrl: "views/help.html" });
    $routeProvider.when("/rstransaction", { controller: "rsTransactionCtrl", templateUrl: "views/rstransaction.html" });
    $routeProvider.when("/clmstransaction", { controller: "CLMSTransactionCtrl", templateUrl: "views/clmstransaction.html" });
    $routeProvider.when("/alarmJobSettings", { controller: "alarmJobsSettingsCtrl", templateUrl: "views/alarmJobSettings.html" });
    $routeProvider.otherwise({ redirectTo: "/login" });
});


logViewerApp.filter('trimMessage', function ($filter) {
    return function (input) {
        if (input.length > 60) {
            return input.substring(0, 60) + "...";
        } else {
            return input;
        };
    };
});

logViewerApp.filter('getById', function () {
    return function (input, id) {
        var i = 0, len = input.length;
        for (; i < len; i++) {
            if (+input[i].Id == +id) {
                return input[i];
            }
        }
        return null;
    }
});

var ModalInstanceCtrl = function ($scope, $modalInstance, parentValues) {

    $scope.logEntry = parentValues.log;


    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
