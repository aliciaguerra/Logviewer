logViewerApp.factory("logViewerFactory", function ($http, $rootScope, $modal, $location) {
    var factory = {};
    var apiURL = "/WebApi/";
    logViewerApp.popupVisible = false;

    factory.GetSettingsViewerResultGet = function (param, callback) {
        $http({
            url: apiURL + "api/Settings",
            method: "GET",
            params: param,
            headers: {
                'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetLogViewerResult = function (params, callback) {
        $http({
            url: apiURL + "api/LogViewer",
            method: "POST",
            data: (params),
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetRSXmlContent = function (params, callback) {
        $http({
            url: apiURL + "api/RSXmlContent",
            method: "GET",
            params: params,
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };


    factory.GetXmlContent = function (params, callback) {
        $http({
            url: apiURL + "api/XmlContent",
            method: "GET",
            params: params,
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetLiveTransactionReport = function (params, callback) {
        $http({
            url: apiURL + "api/stats",
            method: "GET",
            params: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {

            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.reprocessBatch = function (params, callback) {
        $http({
            url: apiURL + "api/QueueProcessing",
            method: "POST",
            data: $.param(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.doLogin = function (params, callback) {
        $http({
            url: apiURL + "api/Auth",
            method: "POST",
            data: $.param(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });

    };

    factory.doLogout = function (params, callback) {
        $http({
            url: apiURL + "api/Auth/Logout",
            method: "GET",
            params: params,
            headers: { 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {
            callback(data, status);
        });

    };

    factory.GetTransactionLogs = function (params, callback) {
        $http({
            url: apiURL + "api/TransactionMessage",
            method: "GET",
            params: params,
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };


    factory.GetApplicationExecutionLog = function (params, callback) {
        $http({
            url: apiURL + "api/ApplicationLogs",
            method: "GET",
            params: params,
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetClaimEvent = function (param, callback) {
        $http({
            url: apiURL + "api/CLMSEvents",
            method: "GET",
            params: param,
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetFileCountStatus = function (param, callback) {
        $http({
            url: apiURL + "api/FileMonitor",
            method: "GET",
            params: param,
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            if (!$rootScope.navigated) {
                factory.handleErrors(status, data);
                callback(data, status);
            }
        });
    };

    factory.GetClaimEventById = function (param, callback) {
        $http({
            url: apiURL + "api/CLMSEvents",
            method: "GET",
            params: param,
            headers: {
                'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetClaimRawData = function (param, callback) {
        $http({
            url: apiURL + "api/CLMSRawData",
            method: "GET",
            params: param,
            headers: {
                'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetAttachments = function (param, callback) {
        $http({
            url: apiURL + "api/Attachments",
            method: "GET",
            params: param,
            headers: {
                'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetComments = function (param, callback) {
        $http({
            url: apiURL + "api/Comments",
            method: "GET",
            params: param,
            headers: {
                'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetShops = function (param, callback) {
        $http({
            url: apiURL + "api/Shop",
            method: "GET",
            params: param,
            headers: {
                'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetRSShopTransaction = function (param, callback) {
        $http({
            url: apiURL + "api/RSShopTransaction",
            method: "GET",
            params: param,
            headers: {
                'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.ReprocessMessage = function (params, callback) {
        $http({
            url: apiURL + "api/QueueProcessing",
            method: "POST",
            data: $.param(params),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.getTokenFromCookie = function () {
        return docCookies.getItem('token');
    }

    factory.GetUserAndRole = function (callback) {

        $http({
            url: "Home/GetUserRole",
            method: "GET",
            param: {},
            headers: {
                'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(status);
        });
    };


    factory.GetRSLogViewerResult = function (params, callback) {
        $http({
            url: apiURL + "api/RSLogViewer",
            method: "POST",
            data: (params),
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.PostSettingsViewerResult = function (params, callback) {
        $http({
            url: apiURL + "api/Settings",
            method: "POST",
            data: (params),
            headers: { 'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie() }
        }).success(function (data, status, headers, config) {
            callback(data, status);

        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };

    factory.GetCLMSMessageViewerResult = function (param, callback) {
        $http({
            url: apiURL + "api/CLMSTransaction",
            method: "GET",
            params: param,
            headers: {
                'Content-Type': 'application/json', 'Authorization-Token': factory.getTokenFromCookie()
            }
        }).success(function (data, status, headers, config) {
            callback(data, status);
        }).error(function (data, status, headers, config) {
            factory.handleErrors(status, data);
            callback(data, status);
        });
    };


    factory.handleErrors = function (status, data) {
        var error = {};
        var showDialog = true;
        if (status == 500) {
            error.message = data;
        }
        else if (status == 501) {
            error.message = data;
        }
        else if (status == 503) {
            error.message = data;
        }
        else if (status == 504) {
            error.message = "Gateway timeout";
        }
        else if (status == 401) {
            error.message = data;
        }
        else if (status == 405) {
            error.message = data;
        }
        else if (status == 404) {
            error.message = "Connection error : could not reach to server or page not available";
        }
        else if (status == 403) {
            docCookies.removeItem('token');
            docCookies.removeItem('userName');
            showDialog = false;
            $location.url('/login');
        }
        else if (status == 400) {
            error.message = "Bad request !!! " + data;
        }
        else {
            error.message = "Unknown error: Could not connect ";
        }
        error.type = "danger";
        error.title = "Error";
        if (showDialog) {
            factory.showDialog(error);
        }
        //event.preventDefault();
    };

    factory.showDialog = function (error) {
        if (logViewerApp.popupVisible)
            return;

        logViewerApp.popupVisible = true;

        var modalInstance = $modal.open({
            templateUrl: 'messageDialog.html',
            controller: MessageDialogCtrl,
            resolve: {
                parentValues: function () {
                    return error;
                }
            }
        });
        modalInstance = undefined;
    };

    return factory;
});
