
logViewerApp.controller('logViewerCtrl', function ($scope, $filter, $modal, logViewerFactory) {

    $scope.tabChange = '';
    $scope.BeforeChangeEvent = function (targetElement) {

       // alert(targetElement.id)
        if ($scope.tabChange != '') {
            var search = document.getElementById($scope.tabChange);
            angular.element(search).triggerHandler('click');
            $scope.tabChange = '';
        }
        //if (targetElement.id === 'step5') {
        //    $scope.tabChange = 'step5';
        //}
        if (targetElement.id === 'step6') {
            $scope.tabChange = 'tabSearch'
        }
       
    };


    $scope.IntroOptions = {
        steps: [
        {
            element: document.querySelector('#step1'),
            intro: "Select Environment from where to fetch Transactions ",
            position: 'bottom'
        },
        {
            element: document.querySelectorAll('#step2')[0],
            intro: "Select how many result to display per page",
            position: 'bottom'
        },
         {
             element: '#step3',
             intro: 'Check this option, if you want to select specific date',
             position: 'bottom'
         },
        {
            element: document.querySelectorAll('#step4')[0],
            intro: "Select Date, if you have to fetch transactions for specific date",
            position: 'bottom'
        },
       
        {
            element: '#step5',
            intro: "Click on this button to fetch logs",
            position: 'bottom'
        },
        {
            element: '#step6',
            intro: 'We load logs here',
            position: 'top'
        },
               
        {
            element: '#step8',
            intro: 'Already selected environment will appear here, you can also change if required',
            position: 'bottom'
        },
         {
             element: '#step9',
             intro: 'Enter claim number to search',
             position: 'bottom'
         },
         {
             element: '#step10',
             intro: 'You can select Log Level from this dropdown',
             position: 'bottom'
         },
         {
             element: '#step11',
             intro: 'Check this if you want to search for specific date',
             position: 'bottom'
         },
         {
             element: '#step12',
             intro: 'Select a date here',
             position: 'bottom'
         },
         {
             element: '#step13',
             intro: 'Click on search button to search logs....',
             position: 'bottom'
         },
         {
             element: '#step14',
             intro: 'And there you go',
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

    $scope.setLevel = function (l) {
        $scope.level = l;
    }
    $scope.closeAlert = function () {
        $scope.isError = false;
        $scope.alertMsg = "";
        $scope.alertType = 'success';

    };

    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1

    };

    $scope.maxDate = new Date();

    $scope.showWeeks = false;

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];


    $scope.environments = [
       { name: 'DEV' },
       { name: 'INT1' }/*, For now we will only enable DEV
       { name: 'INT2' },
       { name: 'CAE' },
       { name: 'PROD' }*/
    ];
    $scope.environment = $scope.environments[0]; //Default value is DEV

    $scope.level = "All";

    $scope.currentPage = 0;
    $scope.items = [];

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    $scope.showDetails = function (i) {
        var found = $filter('getById')($scope.items.AppExecutionLog, i);
        $scope.open(found);      
    };
  
    $scope.changePage = function (page, level) {

        if ($scope.searching) {
            $scope.searchLog(page);
        }
        else {
            $scope.fetchLog(page);
        }
    };

    $scope.results = [20, 50, 100, 250, 500];
    $scope.result = $scope.results[2];

    $scope.levels = [{ level: 'ALL' }, { level: 'INFO' }, { level: 'DEBUG' }, { level: 'WARN' }, { level: 'ERROR' }];
    $scope.level = $scope.levels[0];
    $scope.maxSize = 5;
    $scope.status = false;
    $scope.isError = false;
    $scope.searchLog = function (page) {
        $scope.searching = true;
        $scope.loading = true;
        $scope.status = false;

        if ($scope.claimNumber) {
            var params = {
                page: page,
                pageSize: $scope.result,
                environment: $scope.environment.name,
                searchType: 'ClaimNumber',
                searchParameter: $scope.claimNumber,
                level: $scope.level.level,
            
            };
            if ($scope.specificDate) {
                params.date = $scope.dt.toLocaleDateString()
            }
        }       
        else if($scope.level.level == 'ALL')
        {
            var params = {
                page: page,
                pageSize: $scope.result,
                environment: $scope.environment.name         
            };
            if($scope.specificDate)
            {
                params.searchType = 'Date',
                params.searchParameter = $scope.dt.toLocaleDateString()
            }
        }
        else {
            var params = {
                page: page,
                pageSize: $scope.result,
                environment: $scope.environment.name,
                searchType: 'LogLevel',
                searchParameter: $scope.level.level
            };
            if ($scope.specificDate) {
                params.date = $scope.dt.toLocaleDateString()
            }
        }
        logViewerFactory.GetApplicationExecutionLog(params, function (data, status) {


            if (status == 200) {
                $scope.status = true;
                $scope.items = data;
                $scope.currentPage = page;
                $scope.isError = false;
            }
            else {
                $scope.status = false;
                $scope.items = null;
                $scope.isError = true;
                $scope.alertType = 'danger';
                if (data == '' || data == ' ' || data == undefined) {
                    $scope.alertMsg = 'Could not connect to server';
                }
                else {
                    $scope.alertMsg = ' ' +data;
                }
            }
            $scope.loading = false;
        });
    };

    $scope.getCurrentMessagesEnd = function () {
        if ($scope.status) {
            var end = $scope.items.CurrentPage * $scope.items.PageSize;
            if (end > $scope.items.TotalRows) {
                return $scope.items.TotalRows;
            }
            return end;
        }
    };

    $scope.getTotalMessages = function () {
        if ($scope.status) {
            return $scope.items.TotalRows;
        }
    };

    $scope.getCurrentMessagesStart = function () {
        if ($scope.status) {
            if ($scope.items.TotalRows === 0) {
                return 0;
            }
            var start = (($scope.items.CurrentPage - 1) * $scope.items.PageSize) + 1;
            return start;
        }
    };

    $scope.fetchLog = function (page) {
        $scope.searching = false;
        $scope.loading = true;
        $scope.status = false;

        if ($scope.specificDate) {
            var params = {
                page: page,
                pageSize: $scope.result,
                environment: $scope.environment.name,
                searchType: 'Date',
                searchParameter: $scope.dt.toLocaleDateString()
            };
        }
        else {
            var params = {
                page: page,
                pageSize: $scope.result,
                environment: $scope.environment.name
            };

        }

        logViewerFactory.GetApplicationExecutionLog(params, function (data, status) {

            if (status == 200) {
                $scope.status = true;
                $scope.items = data;
                $scope.currentPage = page;
                $scope.isError = false;
            }
              else {
                logViewerFactory.handleErrors(status, data);
            }
            $scope.loading = false;
        });
    };


    $scope.open = function (log) {
        var modalInstance = $modal.open({
            templateUrl: 'dialog.html',
            controller: ModalInstanceCtrl,
            resolve: {
                parentValues: function () {
                    return {
                        log: log,
                        env: $scope.environment.name
                    };
                }
            }
        });

    };
});

