// This is for Transactions
logViewerApp.controller('mainCtrl', function ($scope, $http, $modal, $injector, logViewerFactory) {

    $scope.timeFrom = new Date();
    $scope.timeTo = new Date();
    $scope.timeFrom.setHours(0);
    $scope.timeFrom.setMinutes(0);
    $scope.timeTo.setHours(23);
    $scope.timeTo.setMinutes(59);
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 2, 3]
    };
    $scope.tabChange = '';
    $scope.BeforeChangeEvent = function (targetElement) {
        if ($scope.tabChange !== '') {
            var search = document.getElementById($scope.tabChange);
            angular.element(search).triggerHandler('click');
            $scope.tabChange = '';
        }
        if (targetElement.id === 'btnLoadLogs')
        {
            $scope.tabChange = 'tabSearch';           
        }
        if (targetElement.id === 'step15')
        {
            $scope.tabChange = 'tabFilter';
        }
        if (targetElement.id === 'step19')
        {
            $scope.tabChange = 'tabBatch';
        }
        if (targetElement.id === 'step24')
        {
            $scope.tabChange = 'step24';
        }
    };

    $scope.IntroOptions = {
        steps: [
        {
            element: document.querySelector('#step1'),
            intro: "Select Environment from where to fetch Transactions ",
            position: 'right'
        },
        {
            element: document.querySelectorAll('#step2')[0],
            intro: "Select how many result to display per page",
            position: 'bottom'
        },
        {
            element: document.querySelectorAll('#step3')[0],
            intro: "Select Date, if you have to fetch transactions for specific date",
            position: 'right'
        },
        {
            element: '#step4',
            intro: 'Check this option, if you want to select specific date',
            position: 'right'
        },
        {
            element: '#step5',
            intro: "Choose message type from here",
            position: 'bottom'
        },
        {
            element: '#step6',
            intro: 'Select a source application for Transactions',
            position: 'bottom'
        },
        {
            element: '#btnLoadLogs',
            intro: 'Click this button to load transactions',
            position: 'bottom'
        },
        {
            element: '#step7',
            intro: 'If you have set environment in Setting tab, this would be set here, else you can change from here',
            position: 'right'
        },
         {
             element: '#step8',
             intro: 'Check this option if you want to select date',
             position: 'bottom'
         },
         {
             element: '#step9',
             intro: 'Select a specific date for searching',
             position: 'bottom'
         },
         {
             element: '#step10',
             intro: 'Enter a Claim number here',
             position: 'bottom'
         },
         {
             element: '#step11',
             intro: 'Click it to search for given claim number',
             position: 'bottom'
         },
         {
             element: '#step12',
             intro: 'Enter Company code here to search specific transaction for that company code',
             position: 'bottom'
         },
         {
             element: '#step13',
             intro: 'Click this button to load transaction for specific company code entered',
             position: 'bottom'
         },
         {
             element: '#step14',
             intro: 'Enter Error code here',
             position: 'bottom'
         },
         {
             element: '#step15',
             intro: 'Click this button to load transaction for specific error code entered',
             position: 'bottom'
         },
         {
             element: '#step16',
             intro: 'Filter already displayed result by Claim Number',
             position: 'right'
         },
         {
             element: '#step17',
             intro: 'Filter already displayed result by Company Code',
             position: 'bottom'
         },
         {
             element: '#step18',
             intro: 'Filter already displayed result by Error code',
             position: 'bottom'
         },
         {
             element: '#step19',
             intro: 'Filter already displayed result by Error Message',
             position: 'bottom'
         },
         {
             element: '#step20',
             intro: 'Select environment to fetch transactions',
             position: 'bottom'
         },
         {
             element: '#step21',
             intro: 'Select Date & time From',
             position: 'bottom'
         },
         {
             element: '#step22',
             intro: 'Select Date and Time To',
             position: 'bottom'
         },
         {
             element: '#step23',
             intro: 'Check this option, if you want to fetch only errors',
             position: 'bottom'
         },
         {
             element: '#step24',
             intro: 'Click this button to search transactions by selected criteria',
             position: 'bottom'
         },
         {
             element: '#step25',
             intro: 'You can select listed transactions by checking this option',
             position: 'bottom'
         },
         {
             element: '#step26',
             intro: 'Click on this button to reprocess selected transactions',
             position: 'bottom'
         },
         {
             element: '#step28',
             intro: 'Go ahead and do it',
             position: 'bottom'
         }
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc: true,
        nextLabel: '<strong>Next</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function () {
        var d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        $scope.timeFrom = d;
    };
    $scope.changeToDate = function () {
        $scope.batchProcessingStatus = 'Reprocess';
        $scope.timeTo = $scope.toDate;
    };
    $scope.changeFromDate = function () {
        $scope.batchProcessingStatus = 'Reprocess';
        $scope.timeFrom = $scope.fromDate;
    };
     
    $scope.messages = [];
    $scope.selectedMessages = [];
    $scope.pages = [];
    $scope.environments = [
        { name: 'DEV' },
        { name: 'INT2' },
        { name: 'INT1' },
        { name: 'CAE' },
        { name: 'PROD' }
    ];

  
    $scope.applications = [{ name: 'SYNCH' }];
    $scope.messageTypes = [
            { name: 'ADXECLAIM' },
            { name: 'ADXEESTIMATECHECK' },
            { name: 'ARCHFNOL' },
            { name: 'ASSIGNMENTACTION' },
            { name: 'AXNASSIGNMENTACTION' },
            { name: 'AXNATTACHMENT' },
            { name: 'AXNCOMMENT' },
            { name: 'AXNEMS' },
            { name: 'AXNTASK' },
            { name: 'CANONICALOUTBOUND' },
            { name: 'CLMSATTACHMENT' },
            { name: 'CMUPDATEFNOL' },
            { name: 'COMMENTS' },
            { name: 'ERROR' },
            { name: 'HEMIESTIMATE' },
            { name: 'HEMIEVENT' },
            { name: 'HEMIFNOL' },
            { name: 'MSOPROESTIMATE' },
            { name: 'MSOPROTASK' },
            { name: 'NOMESSAGETYPE' },
            { name: 'PERFORMANCEGATEWAY' },
            { name: 'WSREQUEST' }
    ];

    $scope.environment = $scope.environments[0]; //Default value is DEV

    $scope.resultsPerPageOptions = [50, 100, 250, 500];
    $scope.resultsPerPage = $scope.resultsPerPageOptions[1];

    $scope.searchClaimNumber = "";
    $scope.searchErrorCode = "";
    $scope.searchCompany = "";
    $scope.loading = false;
    $scope.specificDate = false;

    //pagination setup
    $scope.maxSize = 5;
    //

    //accordion setup
    $scope.oneAtATime = true;
    $scope.isOpen = true;
    //

    //Alert setup
    $scope.alerts = [];

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    ///Date Picker setup

    $scope.today = function () {
        $scope.fromDate = new Date();
        $scope.toDate = new Date();
    };
    $scope.today();
    
    $scope.selectFlag = false;

    $scope.viewReportAgain = function () {

        var rptWin = window.open('report.html');
        if (rptWin === 'undefined' || rptWin === undefined || rptWin === 'null' || rptWin === null) {
          
            var error = {};
            error.message = "You have still disabled popup, please enable popup for this website to view report";
            error.type = "danger";
            error.title = "Error";
            logViewerFactory.showDialog(error);
        }else {
            rptWin.report = $scope.report;
            rptWin.env = $scope.environment.name;
        }
    };

    $scope.confirmBatch = function () {
        $scope.confirmedReprocessing = true;
    };

    $scope.batchProcessingStatus = 'Reprocess';
    $scope.isReprocessing = false;
    $scope.reprocessBatch = function () {
        $scope.selectedMessages.length = 0;
        $scope.confirmedReprocessing = false;
        var p = 0;
        for (var i = 0; i < $scope.messages.TransactionMessages.length; i++)
        {
            if($scope.messages.TransactionMessages[i].reprocess)
            {
                $scope.selectedMessages[p] = $scope.messages.TransactionMessages[i];
                p++;
            }
        }
        var params = {
            environment: $scope.environment.name,
            message: 'none',
            queue: 'none',
            messageId: '-1',
            messages: $scope.selectedMessages
        };
       
        if ($scope.selectedMessages.length > 0) {
            $scope.batchProcessingStatus = 'Reprocessing...please wait !!!';
            $scope.isReprocessing = true;
            logViewerFactory.ReprocessMessage(params, function (data, status) {
                $scope.reprocessYes = "Yes";
                if (data) {
                    $scope.status = true;
                    $scope.batchProcessingStatus = 'Reprocessed';
                    if (status === 200) {
                        var rptWin = window.open('report.html');
                        if (rptWin === 'undefined' || rptWin === undefined || rptWin === 'null' || rptWin === null) {
                            var error = {};
                            error.message = "You have disabled popup, please enable popup for this website to view report";
                            error.type = "danger";
                            error.title = "Error";
                            logViewerFactory.showDialog(error);
                            $scope.report = data;
                            $scope.blocked = true;
                        }else {
                            rptWin.report = data;
                            rptWin.result = "Messages Processed";
                            rptWin.env = $scope.environment.name;
                            $scope.blocked = false;
                        }
                        $scope.statusSuccess = true;
                        $scope.data = "Messages were reprocess. Check report for details.";
                    }
                }else {
                    $scope.status = false;
                }
                $scope.reprocessed = true;
                $scope.isReprocessing = false;
                $scope.confirmation = false;
            });
        }else
        {

            var error = {};
            error.message = "Please select transaction to reprocess";
            error.type = "success";
            error.title = "Info";
            logViewerFactory.showDialog(error);
        }
    };
    $scope.selectAllMsg = function () {
        $scope.batchProcessingStatus = 'Reprocess';
        if (!$scope.selectFlag)
        {     
            for (var i = 0 ; i < $scope.messages.TotalRows; i++) {
                {
                    var obj = $scope.messages.TransactionMessages[i];
                    obj.reprocess = true;
                    $scope.messages.TransactionMessages[i] = obj;                    
                }
            }
        }else
        {
            for (var i = 0 ; i < $scope.messages.TotalRows; i++) {
                {
                    var obj = $scope.messages.TransactionMessages[i];
                    obj.reprocess = false;
                    $scope.messages.TransactionMessages[i] = obj;                    
                }
            }
        }
     
    };
    $scope.maxDate = new Date();

    $scope.showWeeks = false;

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.apiURL = "/WebApi/";
    $scope.closeAlert = function () {
        $scope.isError = false;
        $scope.alertMsg = "";
        $scope.alertType = 'success';
    };
    $scope.searchBatch = function (page) {
        $scope.batchProcessingStatus = 'Reprocess';
        $scope.searchingByCompany = false;
        $scope.searchingByErrorCode = false;
        $scope.searchingByClaim = false;
        $scope.searchingBatch = true;
        $scope.selectFlag = false;
        var params = {
            page: page,
            pageSize: $scope.resultsPerPage,
            environment: $scope.environment.name,
            fromDate: $scope.timeFrom.toLocaleString(),
            toDate: $scope.timeTo.toLocaleString(),
            searchType: 'SearchBatch'
        };

        if ($scope.messageType) {
            params.messageType = $scope.messageType;
        }
        if ($scope.application) {
            params.application = $scope.application;
        }
        if ($scope.onlyErrors)
        {
            params.onlyErrors = true;
        }
        
        $scope.getTransactionMessages(params);
    };

    $scope.getTransactionMessages = function (params)
    {
        $scope.loading = true;
        $scope.messages = [];
        $scope.pages = [];       
        
     
        if ($scope.messageType) {
            params.messageType = $scope.messageType;
        }
        if ($scope.application) {
            params.application = $scope.application;
        }

        logViewerFactory.GetLogViewerResult(params, function (data, status) {
            if (status === 200)
            {
                $scope.messages = data || "Request Failed";
                for (var i = 1; i <= $scope.messages.TotalPages; i++) {
                    $scope.pages.push(i);
                }

            }           
            $scope.status = status;
            $scope.loading = false;
        });
};
    
    $scope.changeEnv = function (e) {

        $scope.environment = e;
    };
    $scope.loadLogs = function (page) {
        $scope.searchingByClaim = false;
        $scope.searchingByCompany = false;
        $scope.searchingByErrorCode = false;
        $scope.searchingBatch = false;
        if ($scope.specificDate) {
            params = {
                page: page,
                pageSize: $scope.resultsPerPage,
                environment: $scope.environment.name,
                searchType: 'Date',
                searchDate: $scope.dt.toLocaleDateString()
            };
        }else {
            params = {
                page: page,
                pageSize: $scope.resultsPerPage,
                environment: $scope.environment.name
            };
        }
        if ($scope.onlyErrors) {
            params.onlyErrors = true;
        }
        $scope.getTransactionMessages(params);
    };

    $scope.getTotalMessages = function () {
        return $scope.messages.TotalRows;
    };

    $scope.messageSelected = function (message) {
       
        var modalInstance = $modal.open({
            templateUrl: 'modalContent.html',
            controller: LogModalInstanceCtrl,
            resolve: {
                parentValues: function () {
                    return {
                        message: message,
                        env: $scope.environment.name
                        
                    };
                }
            }
        });
    };

    $scope.changePage = function (page)
    {
        $scope.selectFlag = false;
        if ($scope.searchingByCompany) {
            $scope.searchByCompany(page);
        }else if ($scope.searchingBatch) {
            $scope.searchBatch(page);
        }else if ($scope.searchingByErrorCode) {
            $scope.searchByErrorCode(page);
        }else if ($scope.searchingByClaim) {
            $scope.searchByClaimNumber(page);
        }else {
            $scope.loadLogs(page);
        }
    };

    $scope.getCurrentMessagesEnd = function () {
        var end = $scope.messages.CurrentPage * $scope.messages.PageSize;
        if (end > $scope.messages.TotalRows) {
            return $scope.messages.TotalRows;
        }
        return end;
    };

    $scope.getCurrentMessagesStart = function () {
        if ($scope.messages.TotalRows === 0) {
            return 0;
        }
        var start = (($scope.messages.CurrentPage - 1) * $scope.messages.PageSize) + 1;
        return start;
    };

    $scope.searchByClaimNumber = function (pg) {
        $scope.searchingByClaim = true;
        $scope.searchingByCompany = false;
        $scope.searchingByErrorCode = false;
        $scope.searchingBatch = false;
        var params = {
            page: pg,
            pageSize: $scope.resultsPerPage,
            environment: $scope.environment.name,
            searchType: 'ByClaimNumber',
            claimNumber: $scope.searchClaimNumber
        };
        if ($scope.specificDate) {
            params.searchDate = $scope.dt.toLocaleDateString();
        }
        if ($scope.onlyErrors) {
            params.onlyErrors = true;
        }
        $scope.getTransactionMessages(params);
    };

    $scope.searchByErrorCode = function (pg) {
        $scope.searchingByErrorCode = true;
        $scope.searchingByCompany = false;      
        $scope.searchingByClaim = false;
        $scope.searchingBatch = false;
        var params = {
            page: pg,
            pageSize: $scope.resultsPerPage,
            environment: $scope.environment.name,
            searchType: 'ByErrorCode',
            errorCode: $scope.searchErrorCode
        };
        if ($scope.specificDate) {
            params.searchDate = $scope.dt.toLocaleDateString();
        }
        if ($scope.onlyErrors) {
            params.onlyErrors = true;
        }
        $scope.getTransactionMessages(params);
    };

    $scope.searchByCompany = function (pg) {
        $scope.searchingByCompany = true;
        $scope.searchingByErrorCode = false;
        $scope.searchingByClaim = false;
        $scope.searchingBatch = false;
        var params = {
            page: pg,
            pageSize: $scope.resultsPerPage,
            environment: $scope.environment.name,
            searchType: 'ByCompany',
            company: $scope.searchCompany
        };
        if ($scope.specificDate) {
            params.searchDate = $scope.dt.toLocaleDateString();
        }
        if ($scope.onlyErrors) {
            params.onlyErrors = true;
        }
        $scope.getTransactionMessages(params);
    };
});
