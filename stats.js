logViewerApp.controller('statsCtrl', function ($scope, $rootScope, $modal, $location, $interval, logViewerFactory) {

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 2, 3]
    };

    $scope.tabChange = '';
    $scope.AfterChangeEvent = function (targetElement) {

        if ($scope.tabChange !== '') {
            var search = document.getElementById($scope.tabChange);
            angular.element(search).triggerHandler('click');
            $scope.tabChange = '';
        }
        if (targetElement.id === 'step10') {
            $scope.tabChange = 'step10';
        }
    };

    $scope.IntroOptions = {
        steps: [
        {
            element: document.querySelector('#step0'),
            intro: "<h4>Dashboard page has various reports such as</h4> <ul><li> Live Stats </li><li>Stats by Date</li><li>Stats by Module</li><ui><br> ",
            position: 'left'
        },
        {
            element: document.querySelectorAll('#step1')[0],
            intro: "You can change environment here, by default, page shows report from Production environment",
            position: 'bottom'
        },
        {
            element: document.querySelectorAll('#step2')[0],
            intro: "Live stats shows data for last 30 min, if you need to change time period, you can use this dropdown",
            position: 'left'
        },
        {
            element: '#step3',
            intro: 'Live Stats shows number of message processed and number of errors against time. <br> This signal when green indicates that error rate is below threshold level defined, if turned red, indicates that error rate has crossed threshold level',
            position: 'left'
        },
        {
            element: '#step4',
            intro: "This section shows total messages, error messages and total percentage for the given time period",
            position: 'bottom'
        },
        {
            element: '#chart1',
            intro: 'This graph is live stats, which shows number of message processed and number of errors per minute'
        },
        {
            element: '#step6',
            intro: 'Select specific date to see total messages processed and total errors for that day '
        },
        {
            element: '#chartDay',
            intro: 'This graph shows stats report for the selected date'
        },
         {
             element: '#step8',
             intro: 'You can see total messages processed and total errors for the selected date in this section'
         },
         {
             element: '#step9',
             intro: 'You can select Date range to get stats by modules',
             position: 'top'
         },
         {
             element: '#step10',
             intro: 'Click this button to show stats by Module Reports',
             position: 'top'
         },
         {
             element: '#chartMessageProcessed',
             intro: 'It shows message processed by module',
             position: 'top'
         },
         {
             element: '#chartErrors',
             intro: 'It shows message errors by module',
             position: 'top'
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
    $scope.totalDailyMessageProcessed = 0;
    $scope.totalDailyCLMSAttachments = 0;
    $scope.totalDailyAXNAttachments = 0;
    $scope.totalDailyErrors = 0;
    $scope.totalDailyPercentage = 0;
    $scope.totalDailyMessagesPerMinute = 0;
    $scope.totalDailyErrorsPerMinute = 0;
    $scope.totalDailyCLMSAttachmentsPerMinute = 0;
    $scope.totalDailyAXNAttachmentsPerMinute = 0;
    $scope.thresholdCrossed = false;
    $scope.timeFrom = new Date();
    $scope.timeTo = new Date();
    $scope.timeFrom.setHours(0);
    $scope.timeFrom.setMinutes(0);
    $scope.timeTo.setHours(23);
    $scope.timeTo.setMinutes(59);
    $scope.totalLiveMessageProcessed = 0;
    $scope.totalLiveCLMSAttachments = 0;
    $scope.totalLiveAXNAttachments = 0;
    $scope.totalLiveErrors = 0;
    $scope.totalLivePercentage = 0;
    $scope.totalLiveMessagesPerMinute = 0;
    $scope.totalLiveErrorsPerMinute = 0;
    $scope.totalLiveCLMSAttachmentsPerMinute = 0;
    $scope.totalLiveAXNAttachmentsPerMinute = 0;
    $scope.messageProcessed = [];
    $scope.messageErrors = [];

    $scope.update = function () {
        var d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        $scope.timeFrom = d;
    };
    $scope.changeToDate = function () {

        $scope.timeTo = $scope.toDate;
        $scope.toDate.setHours(23);
        $scope.toDate.setSeconds(59);
        $scope.toDate.setMinutes(59);
    };
    $scope.changeFromDate = function () {

        $scope.timeFrom = $scope.fromDate;
        $scope.fromDate.setHours(0);
        $scope.fromDate.setSeconds(0);
        $scope.fromDate.setMinutes(0);
    };
    $scope.maxDate = new Date();
    $scope.dailyChart = false;
    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.environments = [
     { name: 'DEV' },
     { name: 'INT2' },
     { name: 'INT1' },
     { name: 'CAE' },
     { name: 'PROD' }
    ];

    $scope.types = [{ statsBy: 'Module' }, { statsBy: 'ErrorCode' }];
    $scope.type = $scope.types[0];
    $scope.countdown = 60;
    $scope.countdownFileMonitor = 300;
    $scope.timeslots = [{ min: 15 }, { min: 30 }, { min: 45 }, { min: 60 }];
    $scope.environment = $scope.environments[4]; //Default value is DEV
    $scope.time = $scope.timeslots[1];

    $scope.showMessageTypeReport = function () {

        if ($scope.fromDate && $scope.toDate) {
            $scope.fromDate.setHours(0);
            $scope.fromDate.setSeconds(0);
            $scope.fromDate.setMinutes(0);
            $scope.toDate.setHours(23);
            $scope.toDate.setSeconds(59);
            $scope.toDate.setMinutes(59);
            $scope.loadedMTChart = false;
            $scope.loadingMTChart = true;
            var params = {
                toDate: $scope.toDate.toLocaleDateString(),
                fromDate: $scope.fromDate.toLocaleDateString(),
                environment: $scope.environment.name,
                type: $scope.type.statsBy
            };

            logViewerFactory.GetLiveTransactionReport(params, function (data, status) {
                if (status === 200) {
                    $scope.countdown = 60;
                    $scope.loadedMTChart = true;
                    $scope.loadingMTChart = false;
                    if ($scope.type.statsBy === 'ErrorCode') {
                        $scope.errorStats = [];
                        for (var i = 0; i < data.ErrorCode.length ; i++) {
                            var temp = [];
                            temp.push(data.ErrorCode[i] + '');
                            temp.push(data.ErrorCount[i]);
                            $scope.errorStats.push(temp);
                        }
                        $scope.statsByErrorChartConfig.series =
                          [{
                              type: 'pie',
                              name: 'Error Stats',
                              data: $scope.errorStats,
                              dataLabels: {
                                  enabled: true,
                                  format: '<b>{point.name}</b>: {point.y}',
                                  style: {
                                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                  }
                              }
                          }];
                    }
                    else {
                        $scope.messageProcessed = [];
                        $scope.messageErrors = [];
                        for (var i = 0; i < data.MessagesProcessed.length ; i++) {
                            var temp = [];
                            temp.push(data.MessageType[i] + '');
                            temp.push(data.MessagesProcessed[i]);
                            $scope.messageProcessed.push(temp);
                            var temp2 = [];
                            temp2.push(data.MessageType[i] + '');
                            temp2.push(data.MessageErrors[i]);
                            $scope.messageErrors.push(temp2);
                        }

                        $scope.messageTypeChartConfig.series =
                            [{
                                type: 'pie',
                                name: 'Message Processed',
                                data: $scope.messageProcessed,
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.y}',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }

                            }];

                        $scope.messageErrorTypeChartConfig.series =
                           [{
                               type: 'pie',
                               name: 'Error Processed',
                               data: $scope.messageErrors,
                               dataLabels: {
                                   enabled: true,
                                   format: '<b>{point.name}</b>: {point.y}',
                                   style: {
                                       color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                   }
                               }
                           }];

                        $scope.messageTypeChartConfig.title.text = 'Message Processed';
                        $scope.messageErrorTypeChartConfig.title.text = 'Error Message';
                    }
                } else {
                    $scope.loadedMTChart = false;
                    $scope.loadingMTChart = false;
                }
            });
        } else {
            var error = {};
            error.message = "Please select proper dates";
            error.type = "danger";
            error.title = "Date(s) not Selected";
            error.loginRequired = false;
            logViewerFactory.showDialog(error);
        }
    };
    $scope.$on('$routeChangeSuccess', function () {
        $rootScope.navigated = false;
    });
    var startTimers = function () {
        $scope.fileTimer = $interval($scope.fileCountCheck, 5 * 60000);
        $scope.mytimeout = $interval($scope.onTimeout, 60000);
        $scope.countDownTimer = $interval($scope.countdownTick, 1000);
        $scope.countDownFile = $interval($scope.countdownFile, 1000);
    };

    var cancelTimers = function () {
        $interval.cancel($scope.mytimeout);
        $interval.cancel($scope.fileTimer);
        $interval.cancel($scope.countDownTimer);
        $interval.cancel($scope.countDownFile);
    };

    $scope.$on("$locationChangeStart", function (event, next, current) {
        $rootScope.navigated = true;
        cancelTimers();
        var b = docCookies.hasItem('token');
        if (!b) {
            $location.url('/login');
        }
    });

    $scope.closeAlert = function (index) {
        $scope.isError = false;
    };

    $scope.showDailyReport = function () {

        if ($scope.dt) {
            $scope.loadingDailyChart = true;
            $scope.dailyChart = false;
            var params = {
                date: new Date($scope.dt).toLocaleDateString(),
                environment: $scope.environment.name,
            };

            logViewerFactory.GetLiveTransactionReport(params, function (data, status) {
                $scope.loadingDailyChart = false;
                if (status === 200) {
                    $scope.dailyChartConfig.series = [{
                        name: 'Message Processed',
                        color: '#4572A7',
                        data: data.MessagesProcessed
                    },
                    {
                        name: 'Errors',
                        color: '#FF1414',
                        data: data.MessageErrors
                    },
                    {
                        name: 'AXNATTACHMENT Messages',
                        color: '#568203',
                        data: data.AxnAttachmentMessages
                    }, {
                        name: 'AXNATTACHMENT Errors',
                        color: '#FF7E00',
                        data: data.AxnAttachmentErrors
                    }, {
                        name: 'CLMSATTACHMENT Messages',
                        color: '#007FFF',
                        data: data.ClmsAttachmentMessages
                    }, {
                        name: 'CLMSATTACHMENT Errors',
                        color: '#AF002A',
                        data: data.ClmsAttachmentErrors
                    }];
                    $scope.dailyChartConfig.xAxis.categories = data.Time;
                    $scope.dailyChartConfig.title.text = 'Source : ' + $scope.environment.name;
                    $scope.dailyChart = true;
                    $scope.calculateDailyTotals();
                }

            });
        } else {
            var error = {};
            error.message = "Please select proper date";
            error.type = "danger";
            error.title = "Date not Selected";
            error.loginRequired = false;

            logViewerFactory.showDialog(error);

        }
    };

    $scope.showThresholdPoint = function () {
        $scope.thresholdCrossedShow = true;
    };
    $scope.hideThresholdPoint = function () {
        $scope.thresholdCrossedShow = false;
    };

    $scope.fetchLogs = function (env) {
        $scope.isLive = false;
        var params = {
            offset: $scope.time.min,
            environment: env,
        };

        logViewerFactory.GetLiveTransactionReport(params, function (data, status) {
            $scope.countdown = 60;
            if (status === 200) {
                $scope.Time = data.Time;
                $scope.isLive = true;
                $scope.chartConfig.series = [{
                    name: 'Message Processed',
                    color: '#4572A7',
                    data: data.MessagesProcessed
                },
                {
                    name: 'Errors',
                    color: '#FF1414',
                    data: data.MessageErrors
                },
                {
                    name: 'AXNATTACHMENT Messages',
                    color: '#568203',
                    data: data.AxnAttachmentMessages
                }, {
                    name: 'AXNATTACHMENT Errors',
                    color: '#FF7E00',
                    data: data.AxnAttachmentErrors
                }, {
                    name: 'CLMSATTACHMENT Messages',
                    color: '#007FFF',
                    data: data.ClmsAttachmentMessages
                }, {
                    name: 'CLMSATTACHMENT Errors',
                    color: '#AF002A',
                    data: data.ClmsAttachmentErrors
                }];

                $scope.chartConfig.xAxis.categories = $scope.Time;
                $scope.chartConfig.title.text = 'Source : ' + $scope.environment.name;
                $scope.calculateTotals();
                $scope.color = "normal";
                $scope.thresholdCheck(data.errorThreshold);
            } else {
                $scope.isLive = true;
            }
        });
    };

    $scope.messageTypeChartConfig = {
        series: [{
            type: 'pie',
            name: 'Message Processed',
            data: $scope.messageProcessed
        }],
        title: {
            text: 'Source : ' + $scope.environment.name
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        tooltip: {
            pointFormat: '{point.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} ',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
    };

    $scope.messageErrorTypeChartConfig = {
        series: [{
            type: 'pie',
            name: 'Error Messages',
            data: $scope.messageErrors
        }],
        title: {
            text: 'Source : ' + $scope.environment.name
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
    };

    $scope.statsByErrorChartConfig = {
        series: [{
            type: 'pie',
            name: 'Error Code',
            data: $scope.errorCode
        }],
        title: {
            text: 'Source : ' + $scope.environment.name
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        tooltip: {
            pointFormat: '{point.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} ',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
    };

    $scope.dailyChartConfig = {

        series: [{
            name: 'Message Processed',
            color: '#4572A7',
            data: $scope.MessagesProcessed
        },
         {
             name: 'Errors',
             color: '#FF1414',
             data: $scope.MessageErrors
         }],
        title: {
            text: 'Source : ' + $scope.environment.name
        },
        xAxis: {
            title: {
                text: 'Time'
            },
            categories: $scope.Time
        },

        yAxis: {
            title: {
                text: 'Messages'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        credits: {
            enabled: false
        },
        options: {
            chart: {
                type: 'spline'
            },
            plotOptions: {
                spline: {
                    dataLabels: {
                        enabled: true,
                        style: {
                            textShadow: '0 0 3px white, 0 0 3px white'
                        }
                    },
                    enableMouseTracking: true,
                    marker: {
                        enabled: false
                    }
                }
            },
        },
        loading: false
    };

    $scope.chartConfig = {
        series: [{
            name: 'Message Processed',
            color: '#4572A7',
            data: $scope.MessagesProcessed
        },
         {
             name: 'Errors',
             color: '#B23944',
             data: $scope.MessageErrors
         }],
        title: {
            text: 'Source : ' + $scope.environment.name
        },
        xAxis: {
            title: {
                text: 'Time'
            },
            categories: $scope.Time
        },

        yAxis: {
            title: {
                text: 'Messages'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        credits: {
            enabled: false
        },
        options: {
            chart: {
                type: 'spline'
            },
            plotOptions: {
                spline: {
                    dataLabels: {
                        enabled: true,
                        style: {
                            textShadow: '0 0 3px white, 0 0 3px white'
                        }
                    },
                    enableMouseTracking: true,
                    marker: {
                        enabled: false
                    }
                }
            },
        },
        loading: false
    };

    $scope.changeTime = function () {
        $scope.fetchLogs($scope.environment.name);
    };

    $scope.countdownTick = function () {
        $scope.countdown = $scope.countdown - 1;
        if ($scope.countdown < 0) {
            $scope.countdown = 60;
        }
    };

    $scope.countdownFile = function () {
        $scope.countdownFileMonitor = $scope.countdownFileMonitor - 1;
        if ($scope.countdownFileMonitor < 0) {
            $scope.countdownFileMonitor = 300;
        }
    };

    $scope.onTimeout = function () {

        var params = {
            offset: 1,
            environment: $scope.environment.name,
        };
        $scope.chartConfig.title.text = 'Source : ' + $scope.environment.name;
        logViewerFactory.GetLiveTransactionReport(params, function (data, status) {
            if (status === 200) {
                $scope.countdown = 60;
                //Check if the results have data, otherwise don't add anything
                if (data.Time.length > 0) {
                    $scope.chartConfig.xAxis.categories.push(data.Time[0]);
                    $scope.chartConfig.series[0].data.push(data.MessagesProcessed[0]);
                    $scope.chartConfig.series[1].data.push(data.MessageErrors[0]);
                    $scope.chartConfig.series[2].data.push(data.AxnAttachmentMessages[0]);
                    $scope.chartConfig.series[3].data.push(data.AxnAttachmentErrors[0]);
                    $scope.chartConfig.series[4].data.push(data.ClmsAttachmentMessages[0]);
                    $scope.chartConfig.series[5].data.push(data.ClmsAttachmentErrors[0]);

                    //Only splice if the current number of messages being displayed on the chart is greater than the minutes selected
                    if ($scope.chartConfig.xAxis.categories.length > $scope.time.min) {
                        $scope.chartConfig.xAxis.categories.splice(0, 1);
                        $scope.chartConfig.series[0].data.splice(0, 1);
                        $scope.chartConfig.series[1].data.splice(0, 1);
                        $scope.chartConfig.series[2].data.splice(0, 1);
                        $scope.chartConfig.series[3].data.splice(0, 1);
                        $scope.chartConfig.series[4].data.splice(0, 1);
                        $scope.chartConfig.series[5].data.splice(0, 1);
                    }
                    $scope.calculateTotals();
                    $scope.color = "normal";
                    $scope.thresholdCheck(data.errorThreshold);
                }
            }
        });
    };

    // File counter Code -START
    $scope.FileMonitor_CM = 0;
    $scope.FileMonitor_ADXE = 0;
    $scope.FileMonitor_EAI = 0;
    $scope.fileCountAvailable = false;
    $scope.circle_cm = 'circle-green';
    $scope.circle_adxe = 'circle-green';
    $scope.circle_eai = 'circle-green';

    $scope.fileCountCheck = function () {

        var params = {
            environment: $scope.environment.name,
        };
        logViewerFactory.GetFileCountStatus(params, function (data, status) {
            $scope.countdownFileMonitor = 300;
            if (status === 200) {
                if (data) {

                    $scope.fileCountAvailable = true;
                    $scope.FileMonitor_CM = data.CM;
                    $scope.FileMonitor_ADXE = data.ADXE;
                    $scope.FileMonitor_EAI = data.EAI;

                    data.CM > data.Threshold ? $scope.circle_cm = 'circle-red' : $scope.circle_cm = 'circle-green';
                    data.ADXE > data.Threshold ? $scope.circle_adxe = 'circle-red' : $scope.circle_adxe = 'circle-green';
                    data.EAI > data.Threshold ? $scope.circle_eai = 'circle-red' : $scope.circle_eai = 'circle-green';
                }
            } else {
                $scope.FileMonitor_CM = 0;
                $scope.FileMonitor_ADXE = 0;
                $scope.FileMonitor_EAI = 0;
            }
        });
    };

    $scope.init = function () {
        $scope.fileCountCheck(); // Call once    
        $scope.today();
        $scope.fetchLogs($scope.environment.name);
        $scope.showDailyReport($scope.environment.name);
        startTimers();
    };

    // File counter Code -END
    $scope.changeEnv = function (e) {
        $scope.countdownFileMonitor = 300;
        $scope.environment = e;
        $scope.thresholdCrossed = false;
        $scope.fetchLogs($scope.environment.name);
        $scope.showDailyReport($scope.environment.name);
      //  $scope.GetErrorStats();
        cancelTimers();
        startTimers();
    };

    $scope.today = function () {
        $scope.fromDate = new Date(new Date().setDate(new Date().getDate() - 1));
        $scope.toDate = new Date(new Date().setDate(new Date().getDate() - 1));
        $scope.dt = new Date(new Date().setDate(new Date().getDate() - 1));
    };

    $scope.calculateTotals = function () {
        $scope.totalLiveMessageProcessed = 0;
        $scope.totalLiveErrors = 0;
        $scope.totalLiveAXNAttachments = 0;
        $scope.totalLiveCLMSAttachments = 0;
        for (var i = 0; i < $scope.chartConfig.series[0].data.length; i++) {
            var mp = $scope.chartConfig.series[0].data[i];

            if (mp !== undefined) {
                $scope.totalLiveMessageProcessed += mp;
            }
            var le = $scope.chartConfig.series[1].data[i];
            if (le !== undefined) {
                $scope.totalLiveErrors += le;
            }
            var axn = $scope.chartConfig.series[2].data[i];
            if (axn !== undefined) {
                $scope.totalLiveAXNAttachments += axn;
            }
            var clms = $scope.chartConfig.series[4].data[i];
            if (clms !== undefined) {
                $scope.totalLiveCLMSAttachments += clms;
            }
        }
        $scope.totalLivePercentage = (($scope.totalLiveErrors / $scope.totalLiveMessageProcessed) * 100);
        $scope.totalLiveMessagesPerMinute = $scope.totalLiveMessageProcessed / $scope.time.min;
        $scope.totalLiveErrorsPerMinute = $scope.totalLiveErrors / $scope.time.min;
        $scope.totalLiveAXNAttachmentsPerMinute = $scope.totalLiveAXNAttachments / $scope.time.min;
        $scope.totalLiveCLMSAttachmentsPerMinute = $scope.totalLiveCLMSAttachments / $scope.time.min;
    };

    $scope.calculateDailyTotals = function () {
        $scope.totalDailyMessageProcessed = 0;
        $scope.totalDailyErrors = 0;
        $scope.totalDailyAXNAttachments = 0;
        $scope.totalDailyCLMSAttachments = 0;
        for (var i = 0; i < $scope.dailyChartConfig.series[0].data.length; i++) {
            var mp = $scope.dailyChartConfig.series[0].data[i];
            if (mp !== undefined) {
                $scope.totalDailyMessageProcessed += mp;
            }
            var le = $scope.dailyChartConfig.series[1].data[i];
            if (le !== undefined) {
                $scope.totalDailyErrors += le;
            }

            var axn = $scope.dailyChartConfig.series[2].data[i];
            if (axn !== undefined) {
                $scope.totalDailyAXNAttachments += axn;
            }
            var clms = $scope.dailyChartConfig.series[4].data[i];
            if (clms !== undefined) {
                $scope.totalDailyCLMSAttachments += clms;
            }
        }
        $scope.totalDailyPercentage = (($scope.totalDailyErrors / $scope.totalDailyMessageProcessed) * 100);
        $scope.totalDailyMessagesPerMinute = $scope.totalDailyMessageProcessed / 1440;
        $scope.totalDailyErrorsPerMinute = $scope.totalDailyErrors / 1440;
        $scope.totalDailyAXNAttachmentsPerMinute = $scope.totalDailyAXNAttachments / 1440;
        $scope.totalDailyCLMSAttachmentsPerMinute = $scope.totalDailyCLMSAttachments / 1440;
    };

    $scope.thresholdCheck = function (threshold) {
        $scope.thresholdPoint = [];

        $scope.thresholdCrossed = false;

        for (var i = 0; i < $scope.chartConfig.series[0].data.length ; i++) {
            if ((($scope.chartConfig.series[1].data[i] / $scope.chartConfig.series[0].data[i]) * 100) > threshold) {
                $scope.thresholdCrossed = true;
                var thresholdPoints = {};
                thresholdPoints.error = $scope.chartConfig.series[1].data[i];
                thresholdPoints.time = $scope.chartConfig.xAxis.categories[i];
                thresholdPoints.message = $scope.chartConfig.series[0].data[i];
                thresholdPoints.percentage = ($scope.chartConfig.series[1].data[i] / $scope.chartConfig.series[0].data[i]) * 100;
                $scope.color = "red";
                $scope.thresholdPoint.push(thresholdPoints);
            }
        }
    };
});
