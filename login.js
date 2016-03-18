
logViewerApp.controller('loginCtrl', function ($scope, $location, logViewerFactory) {
    $scope.logs = 'active';
    $scope.selectedMenu = 'stats';
   
    $scope.getUsername = function () {
        return docCookies.getItem('userName');
    };

    $scope.isTokenPresent = function () {
        //return sessionStorage.AuthToken != undefined || sessionStorage.AuthToken != '';
        return docCookies.hasItem('token');
    };

    $scope.isCurrrentPath = function (menu) {
        return ($location.path().indexOf(menu) > 0);
    };

    $scope.init = function () {
        if ($scope.isTokenPresent()) {//if user is returning let's send them to transactions instead of Dashboard to release load of Dashboard.
            $location.path("/transactions"); 
        }
    };

    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }

    $scope.doLogin = function (event) {
      
        if (event.type == 'click' || event.keyCode == 13) {
            if ($scope.userName == '' || $scope.userName == undefined || $scope.password == '' || $scope.password == undefined) {
                $scope.result = 'Username or Password cannot be empty';
                return;
            }
            $scope.loading = true;
            $scope.result = undefined;
            var params = {
                userName: $scope.userName,
                password: $scope.password
            };

            logViewerFactory.doLogin(params, function (result, status) {
                if (status == 200) {
                    var dat = new Date();
                    docCookies.setItem("token", result, dat.addDays(30));
                    docCookies.setItem("userName", $scope.userName, dat.addDays(30));
                    $scope.loading = false;
                    $scope.result = undefined;
                    $location.url('/stats');
                }
                else {
                    $scope.result = result;
                    $scope.loading = false;
                }
            });
        }
    };

    $scope.doLogout = function () {
        docCookies.removeItem('token');
        docCookies.removeItem('userName');
        $location.url('/login');
    };

});

