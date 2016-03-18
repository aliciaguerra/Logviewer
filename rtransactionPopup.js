var RSLogModalInstanceCtrl = function ($scope, $modalInstance, $location, $http, $modal, parentValues, logViewerFactory) {
    $scope.message = parentValues.message;
    $scope.XmlContent = parentValues.xmlContent;
    $scope.loadingXmlContent = false;
    $scope.environment = parentValues.env;
    $scope.popupPanel = 'message';
    $scope.items = [];
    $scope.ResponceItem = [];

    $scope.loadRequestMessages = function () {
        $scope.makeActiveTab("messages");
    };

    var serviceParams = {
        id: $scope.message.RS_TRANSACTION_ID,
        env: parentValues.env
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.makeActiveTab = function (tab) {
        switch (tab) {
            case "messages":
                $scope.messageClass = "activetab";
                $scope.RequestClass = "";
                $scope.ResponceClass = "";
                break;
            case "Request":
                $scope.messageClass = "";
                $scope.RequestClass = "activetab";
                break;
            case "Responce":
                $scope.messageClass = "";
                $scope.RequestClass = "";
                $scope.ResponceClass = "activetab";
                break;
            default:
        }
    };

    $scope.messageClass = "activetab";

    $scope.loadRequest = function (page) {
        $scope.makeActiveTab("Request");       
        var params = {
            environment: parentValues.env,
            ProcessId: $scope.message.RS_PROCESS_ID,
            rsmessageType: 'B2BACTIVITY.REQUEST'
        };

       $scope.loadingContent = true;
        $scope.status = false;
        logViewerFactory.GetRSLogViewerResult(params, function (data, status) {
            $scope.loadingContent = false;
            if (status == 200) {
                $scope.status = true;
                $scope.items = data;
            }
        });
    };

    $scope.loadResponce = function (page) {
        $scope.makeActiveTab("Responce");     
        var params = {
            environment: parentValues.env,
            ProcessId: $scope.message.RS_PROCESS_ID,
            rsmessageType: 'B2BACTIVITY.RESPONSE'
        };
  
        $scope.loadingContent = true;
        $scope.status = false;
        logViewerFactory.GetRSLogViewerResult(params, function (data, status) {
            $scope.loadingContent = false;
            if (status == 200) {
                $scope.status = true;
                $scope.ResponceItem = data;
            }
        });
    };

    $scope.getXmlContent = function (serviceParams) {
        $scope.loadingXmlContent = true;
        logViewerFactory.GetRSXmlContent(serviceParams, function (data, status) {
            $scope.loadingXmlContent = false;
            if (status == 200) {
                $scope.XmlContent = data.RS_MESSAGE_XML || "No XML present";
                $scope.status = status;
            }
        });
    };
    $scope.getXmlContent(serviceParams);
};
