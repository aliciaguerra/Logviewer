// This is for CLMS Transactions
logViewerApp.controller('CLMSTransactionCtrl', function ($scope, $http, $modal, $injector, logViewerFactory) {

    $scope.tabChange = '';
    $scope.BeforeChangeEvent = function (targetElement) {
        if ($scope.tabChange !== '') {
            var search = document.getElementById($scope.tabChange);
            angular.element(search).triggerHandler('click');
            $scope.tabChange = '';
        }           
    };
   
    $scope.messages = [];
    $scope.environments = [
        { name: 'DEV' },
        { name: 'INT2' },
        { name: 'INT1' },
        { name: 'CAE' },
        { name: 'PROD' }
    ];
  
    $scope.environment = $scope.environments[0]; //Default value is DEV   
    $scope.searchClaimNumber = "";
    $scope.loading = false;
      
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
 
    $scope.getCLMSMessages = function (params) {
        $scope.loading = true;
        $scope.messages = [];

        logViewerFactory.GetCLMSMessageViewerResult(params, function (data, status) {
            if (status === 200) {
                $scope.messages = data;
            }
            $scope.status = status;
            $scope.loading = false;
        });
    };

    $scope.changeEnv = function (e) {
        $scope.environment = e;
    };

    $scope.searchByClaimNumber = function () {       
        var params = {          
            environment: $scope.environment.name,           
            claimNumber: $scope.searchClaimNumber
        };          
        $scope.getCLMSMessages(params);
    };

    $scope.CLMSMessageSelect = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'CLMSModalContent.html',
            controller: CLMSTransactionMessageCtrl,
            resolve: {
                parentValues: function () {
                    return {
                        message: data,
                        env: $scope.environment.name
                    };
                }
            }
        });
    };   
});
