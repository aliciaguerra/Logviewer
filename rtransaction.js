// This is for RS Transactions
logViewerApp.controller('rsTransactionCtrl', function ($scope, $http, $modal, $injector, logViewerFactory) {

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

    $scope.errorCodes = [{val:112},{val:167},{val:168},{val:2},{val:204},{val:205}];
    $scope.SearchingByDates = true;
    $scope.tabChange = '';
    $scope.BeforeChangeEvent = function (targetElement) {
        if ($scope.tabChange !== '') {
            var search = document.getElementById($scope.tabChange);
            angular.element(search).triggerHandler('click');
            $scope.tabChange = '';
        }
        if (targetElement.id === 'btnLoadLogs') {
            $scope.tabChange = 'tabSearch';
        }
        if (targetElement.id === 'step13') {
            $scope.tabChange = 'tabFilter';
        }
        if (targetElement.id === 'step16') {
            $scope.tabChange = 'tabDate';
        }
    };

    $scope.datetabevent = function () {
        $scope.SearchingByDates = true;
    };

    $scope.IntroOptions = {
        steps: [
        {
            element: document.querySelector('#step1'),
            intro: "Select Environment from where to fetch RS Transactions ",
            position: 'right'
        },
        {
            element: document.querySelectorAll('#step2')[0],
            intro: "Select how many result to display per page",
            position: 'bottom'
        },
        {
            element: document.querySelectorAll('#step3')[0],
            intro: "Select Date, if you have to fetch RS Transactions for specific date",
            position: 'right'
        },
        {
            element: '#step5',
            intro: "Choose message type from here",
            position: 'bottom'
        },
       {
           element: '#step25',
           intro: "Choose Company Name from here",
           position: 'bottom'
       },
        {
            element: '#Step26',
            intro: "Choose Feed type from here",
            position: 'bottom'
        },
          {
              element: '#step4',
              intro: 'Check this option, if you want to select specific date',
              position: 'right'
          },
        {
            element: '#btnLoadLogs',
            intro: 'Click this button to load RS Transactions',
            position: 'bottom'
        },
        {
            element: '#step7',
            intro: 'If you have set environment in Setting tab, this would be set here, else you can change from here',
            position: 'right'
        },
        {
            element: '#step9',
            intro: 'Select a specific date for searching',
            position: 'bottom'
        },
        {
            element: '#step8',
            intro: 'Check this option if you want to select date',
            position: 'bottom'
        },
        {
            element: '#step10',
            intro: 'Enter a Claim number here',
            position: 'bottom'
        },
        {
            element: '#step11',
            intro: 'Click it to search for given Claim number',
            position: 'bottom'
        },
        {
            element: '#step29',
            intro: 'Enter a RO number here',
            position: 'bottom'
        },
        {
            element: '#step30',
            intro: 'Click it to search for given RO number',
            position: 'bottom'
        },

        {
            element: '#step12',
            intro: 'Enter a Shop Name here',
            position: 'right'
        },
        {
            element: '#step13',
            intro: 'Click it to search for given Shop Name',
            position: 'bottom'
        },
        {
            element: '#step16',
            intro: 'Filter already displayed result by Claim Number',
            position: 'bottom'
        },
        {
            element: '#step20',
            intro: 'Select environment to fetch RsTransactions',
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
              intro: 'Click this button to search RS Transactions by selected criteria',
              position: 'bottom'
          },
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
        $scope.timeTo = $scope.toDate;
    };
    $scope.changeFromDate = function () {
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

    $scope.messageTypes = [
            { name: 'B2BACTIVITY.REQUEST' },
            { name: 'B2BACTIVITY.RESPONSE' }
    ];

    $scope.Companyname = [
        { name: 'Liberty Mutual Insurance Company' },
        { name: 'Safeco Insurance Company' }
    ];

    $scope.Feedtype = [
      { name: 'Cyncast', value: "AXCiecaService" },
      { name: 'Autofocus', value: "AXiAutoFocusService" }
    ];
    $scope.environment = $scope.environments[0]; //Default value is DEV

    $scope.resultsPerPageOptions = [50, 100, 250, 500];
    $scope.resultsPerPage = $scope.resultsPerPageOptions[1];

    $scope.searchClaimNumber = "";
    $scope.searchRoNumber = "";
    $scope.searchShop = "";
    $scope.searchShop = "";
    $scope.loading = false;
    $scope.specificDate = false;

    //pagination setup
    $scope.maxSize = 5;

    //accordion setup
    $scope.oneAtATime = true;
    $scope.isOpen = true;

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

    $scope.closeAlert = function () {
        $scope.isError = false;
        $scope.alertMsg = "";
        $scope.alertType = 'success';
    };

    $scope.changeFeedType = function () {
        alert($scope.FeedType.value);
    };
    $scope.searchByDates = function (page) {
        $scope.SearchingByDates = true;
        var params = {
            page: page,
            pageSize: $scope.resultsPerPage,
            environment: $scope.environment.name,
            fromDate: $scope.timeFrom.toLocaleString(),
            toDate: $scope.timeTo.toLocaleString(),
            searchType: 'SearchDateRange'
        };

        if ($scope.messageType) {
            params.messageType = $scope.messageType;
        }
        if ($scope.CompanyName) {
            params.CompanyName = $scope.CompanyName;
        }
        if ($scope.FeedType) {

            params.FeedType = $scope.FeedType.value;
            console.log(params.FeedType);

        }
        if ($scope.onlyErrors) {
            params.onlyErrors = true;
        }
        $scope.getRSMessages(params);
    };

    $scope.getRSMessages = function (params) {
        $scope.loading = true;
        $scope.messages = [];
        $scope.pages = [];

        if ($scope.messageType) {
            params.messageType = $scope.messageType;
        }
        if ($scope.CompanyName) {
            params.CompanyName = $scope.CompanyName;
        }
        if ($scope.FeedType) {
            params.FeedType = $scope.FeedType.value;
        }

        logViewerFactory.GetRSLogViewerResult(params, function (data, status) {
            if (status === 200) {
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
    $scope.RequestMessages = function (page) {
        $scope.SearchingByDates = false;
        if ($scope.specificDate) {
            params = {
                page: page,
                pageSize: $scope.resultsPerPage,
                environment: $scope.environment.name,
                searchType: 'Date',
                searchDate: $scope.dt.toLocaleDateString()
            };
        } else {
            params = {
                page: page,
                pageSize: $scope.resultsPerPage,
                environment: $scope.environment.name
            };
        }
        if ($scope.onlyErrors) {
            params.onlyErrors = true;
        }
        $scope.getRSMessages(params);
    };

    $scope.getTotalMessages = function () {
        return $scope.messages.TotalRows;
    };

    $scope.RequestMessageSelected = function (requests) {

        var modalInstance = $modal.open({
            templateUrl: 'rsModalContent.html',
            controller: RSLogModalInstanceCtrl,
            resolve: {
                parentValues: function () {
                    return {
                        message: requests,
                        env: $scope.environment.name
                    };
                }
            }
        });
    };

    $scope.changePage = function (page) {
        if ($scope.searchClaimNumber) {
            $scope.searchByClaimNumber(page);
        }
        else if ($scope.searchShopName) {
            $scope.searchByShopName(page);
        }
        else if ($scope.SearchingByDates) {
            $scope.searchByDates(page);
        }
        else if ($scope.searchRoNumbers) {
            $scope.searchRoNumber(page);
        }
        else {
            $scope.RequestMessages(page);
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
        $scope.SearchingByDates = false;
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
        $scope.getRSMessages(params);
    };

    //search by Claim Id
    $scope.searchByShopName = function (pg) {
        $scope.SearchingByDates = false;
        $scope.searchingByClaim = false;
        $scope.searchingByShop = true;
        var params = {
            page: pg,
            pageSize: $scope.resultsPerPage,
            environment: $scope.environment.name,
            searchType: 'ByShopName',
            ShopName: $scope.searchShopName
        };
        if ($scope.specificDate) {
            params.searchDate = $scope.dt.toLocaleDateString();
        }
        if ($scope.onlyErrors) {
            params.onlyErrors = true;
        }
        $scope.getRSMessages(params);
    };

    //search by RO Number
    $scope.searchRoNumber = function (pg) {
        $scope.SearchingByDates = false;
        $scope.searchingByClaim = false;
        $scope.searchingByShop = true;
        var params = {
            page: pg,
            pageSize: $scope.resultsPerPage,
            environment: $scope.environment.name,
            searchType: 'ByRoNumber',
            RoNumber: $scope.searchRoNumbers
        };
        if ($scope.specificDate) {
            params.searchDate = $scope.dt.toLocaleDateString();
        }
        if ($scope.onlyErrors) {
            params.onlyErrors = true;
        }
        $scope.getRSMessages(params);
    };
});
