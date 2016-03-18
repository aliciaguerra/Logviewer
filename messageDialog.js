
var MessageDialogCtrl = function ($scope, $modalInstance, $location, $http, $modal, parentValues, logViewerFactory) {
    $scope.message = parentValues.message;
    $scope.parentValues = parentValues;

    $scope.close = function () {      
        logViewerApp.popupVisible = false;
        $modalInstance.close();

    };
   
};
