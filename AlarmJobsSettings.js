// This is for RS Transactions
logViewerApp.controller('alarmJobsSettingsCtrl', function ($scope, $http, $modal, $injector, logViewerFactory) {

    $scope.currentDate = new Date();
    $scope.loading = true;
    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 2, 3]
    };

    $scope.ismeridian = false;
    
    $scope.update = function () {
        var d = new Date();
        d.setHours(23);
        d.setMinutes(59);
        $scope.jobTime = d;
    };

    $scope.changed = function (jobTime) {
        $scope.hours = $scope.jobTime.getHours()
        $scope.minutes = $scope.jobTime.getMinutes()
        if ($scope.jobTime.getHours() < 10) {
            $scope.hours = "0" + $scope.jobTime.getHours()
        }
        if (jobTime.getMinutes() < 10) {
            $scope.minutes = "0" + $scope.jobTime.getMinutes()
        }
        $scope.settings[5].Value = $scope.hours + ":" + $scope.minutes;
    };

    $scope.clear = function () {
        $scope.mytime = null;
    };

    $scope.checked = false;
    $scope.enable = true;
    $scope.Validation = function () {
        $scope.clear();
        $scope.enable = true;
        if ($scope.settings[0].Value == '') {
            $scope.ErrorThershold = 'Error Thershold Required';
            $scope.enable = false;
        }      
        if (isNaN($scope.settings[0].Value)) {
            $scope.ErrorThersholdnumber = 'Please Enter Number';
            $scope.enable = false;
        }
        if ($scope.settings[0].Value > 100 || $scope.settings[0].Value < 1 ) {
            $scope.ErrorThershold = 'Please Enter The Range Of Value Between 1 to 100 ';
            $scope.enable = false;
        }
        if ($scope.settings[1].Value == '') {
            $scope.FileThreshold = 'File Threshold Required';
            $scope.enable = false;
        }
        if ($scope.settings[1].Value > 1000 || $scope.settings[1].Value < 1) {
            $scope.FileThreshold = 'Please Enter The Range Of Value Between 1 to 1000 ';
            $scope.enable = false;
        }
        if (isNaN($scope.settings[1].Value)) {
            $scope.FileThresholdnumber = 'Please Enter Number';
            $scope.enable = false;
        }
        if ($scope.settings[2].Value == '') {
            $scope.FirstLoadMinutes = 'First Load Minutes Required';
            $scope.enable = false;
        }
        if (isNaN($scope.settings[2].Value)) {
            $scope.FirstLoadMinutesnumber = 'Please Enter Number';
            $scope.enable = false;
        }
        if ($scope.settings[5].Value == '') {
            $scope.AlarmJobRunTime = 'Alarm Job Run Time Required';
            $scope.enable = false;
        }
        if ($scope.settings[4].Value == '') {
            $scope.YellowZoneThreshold = 'Yellow Zone Threshold Required';
            $scope.enable = false;
        }
        if (isNaN($scope.settings[4].Value)) {
            $scope.YellowZoneThresholdnumber = 'Please Enter Number';
            $scope.enable = false;
        }
        if ($scope.settings[8].Value == '') {
            $scope.HoursBack = 'Number Of Hours Back Required';
            $scope.enable = false;
        }
        if (isNaN($scope.settings[8].Value)) {
            $scope.HoursBacknumber = 'Please Enter Number';
            $scope.enable = false;
        }
        if ($scope.settings[9].Value == '') {
            $scope.AlarmJobFrequencey = 'Alarm Job Frequencey Required';
            $scope.enable = false;
        }
        if (isNaN($scope.settings[9].Value)) {
            $scope.AlarmJobFrequenceynumber = 'Please Enter Number';
            $scope.enable = false;
        }
        if ($scope.settings[3].Value == '') {
            $scope.RedZoneThreshold = 'Red Zone Threshold Required';
            $scope.enable = false;
        }
        if (isNaN($scope.settings[3].Value)) {
            $scope.RedZoneThresholdnumber = 'Please Enter Number';
            $scope.enable = false;
        }
        if ($scope.settings[3].Value <1440 || $scope.settings[3].Value  > 7200) {
            $scope.RedZoneThresholdnumber = 'Please enter the range of values between 1440-7200';
            $scope.enable = false;
        }
        if($scope.settings[3].Value <= $scope.settings[4].Value)
        {
            $scope.RedZoneThresholdnumber = 'Red Zone threshold must be greater than Yellow Zone threshold';
            $scope.enable = false;
        }
        if ($scope.settings[4].Value < 1440 || $scope.settings[4].Value > 7200) {
            $scope.YellowZoneThresholdnumber = 'Please enter the range of values between 1440-7200';
            $scope.enable = false;
        }
        if ($scope.settings[4].Value >= $scope.settings[3].Value) {
            $scope.YellowZoneThresholdnumber = 'Yellow Zone threshold must be less than Red Zone threshold';
            $scope.enable = false;
        }
        if ( $scope.settings[8].Value < 121 && $scope.settings[8].Value > 23) {           
        }
        else
        {
            $scope.HoursBacknumber = 'Please enter the range of values between 24-120';
            $scope.enable = false;
        }
        if ($scope.settings[10].Value == '') {
            $scope.environment = 'Environment Required';
            $scope.enable = false;
        }
        if ($scope.settings[6].Value == '') {
            $scope.EmailReportTo = 'Email Distribution Required';
            $scope.enable = false;
        }
    };

    $scope.env = ["PROD", "DEV", "INT1", "INT2", "CAE"];
    $scope.selectedEnv = $scope.env[1];
    $scope.getSettingMessages = function () {
        $scope.messages = [];
        $scope.loading = true;
        var params = {
            Id: 0
        };
        logViewerFactory.GetSettingsViewerResultGet(params, function (data, status) {
            if (status === 200) {
                $scope.settings = data;
                $scope.loading = false;
                $scope.selectedEnv = $scope.settings[10].Value;
                var time = $scope.settings[5].Value;
                var hm = time.split(":");
                $scope.currentDate.setHours(hm[0]);
                $scope.currentDate.setMinutes(hm[1]);
                $scope.jobTime = $scope.currentDate;
                $scope.enforceAssignments = data;
                if ($scope.enforceAssignments[7].Value === "True") {
                    $scope.checked = true;
                }
                else {
                    $scope.checked = false;
                }
            }
        });
    };

    $scope.save = function () {
        $scope.ValidEmailID();
        if ($scope.enable) {
            $scope.loading = true;
            var params = {
                Id: -1,
                errorThreshold: $scope.settings[0].Value,
                FileThreshold: $scope.settings[1].Value,
                firstLoadMin: $scope.settings[2].Value,
                mapRedThresholdSetting: $scope.settings[3].Value,
                mapYellowThresholdSetting: $scope.settings[4].Value,
                alarmJobTime: $scope.settings[5].Value,
                distributionList: $scope.settings[6].Value,
                enforceAssignments: $scope.settings[7].Value,
                noOfHoursBack: $scope.settings[8].Value,
                alarmJobFrequency: $scope.settings[9].Value,
                environments: $scope.settings[10].Value
            }
            logViewerFactory.PostSettingsViewerResult(params, function (data, status) {
                if (data == 0) {
                    $scope.getSettingMessages();
                    $scope.edit = false;
                    return;
                }
            });
        }
        else {
            alert("Required fields are not present");
        }
    };

    $scope.ValidEmailID = function () {
        $scope.EmailID = $scope.settings[6].Value.split(',');
        $scope.enable = true;
        for (var i = 0 ; i < $scope.EmailID.length; i++) {
            var checkID = $scope.EmailID[i];
            var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
            if (filter.test(checkID)) {

            }
            else {
                $scope.EmailReportTo = 'Invalid Email Address' + ' ' + $scope.EmailID[i];
                $scope.enable = false;
            }
        }
    };

    $scope.editSetting = function () {
        $scope.edit = !$scope.edit;
        $scope.settingsCopy = [];
        $scope.settingsCopy = $.extend(true, {}, $scope.settings);
    };

    $scope.cancel = function () {
        $scope.edit = false;
        $scope.settings = [];

        $scope.settings = $.extend(true, {}, $scope.settingsCopy);
        $scope.checked = $scope.settings[7].Value === 'True' ? true : false;
        $('#enforceAssignment').prop('checked', $scope.checked); //somehow angular js autobining does not work here :(
        $scope.clear();
    };

    $scope.clear = function () {
        $scope.ErrorThershold = '';
        $scope.EmailReportTo = '';
        $scope.environment = '';
        $scope.RedZoneThreshold = '';
        $scope.AlarmJobFrequencey = '';
        $scope.HoursBack = '';
        $scope.YellowZoneThreshold = '';
        $scope.AlarmJobRunTime = '';
        $scope.FileThreshold = '';
        $scope.FirstLoadMinutes = '';
        $scope.ErrorThersholdnumber = '';
        $scope.RedZoneThresholdnumber = '';
        $scope.AlarmJobFrequenceynumber = '';
        $scope.HoursBacknumber = '';
        $scope.YellowZoneThresholdnumber = '';
        $scope.FileThresholdnumber = '';
        $scope.FirstLoadMinutesnumber = '';
    }
});
