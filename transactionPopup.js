var LogModalInstanceCtrl = function ($scope, $modalInstance, $location, $http, $modal, parentValues, logViewerFactory) {
    $scope.message = parentValues.message;
    $scope.XmlContent = parentValues.xmlContent;
    $scope.loadingXmlContent = false;
    $scope.environment = parentValues.env;
    $scope.apiURL = "/WebApi/";
    $scope.popupPanel = 'message';
    $scope.confirmation = false;
    $scope.reprocess = function () {
        $scope.confirmation = true;
    };
    $scope.items = [];
    $scope.currentPage = 0;
    $scope.page = 1;
    $scope.totalItems = 0;
    $scope.loadedLogs = false;
    $scope.resultPerPage = 500;
    $scope.noRecord = false;
    $scope.reprocessSuccess = true;

    $scope.loadMessages = function () {
        $scope.makeActiveTab("messages");
    };

    //$scope.GetEvents = function (id) {
    //    $scope.loadedLogs = false;
    //    var params = {
    //        env: parentValues.env,
    //        claimId: id
    //    };
    //    $scope.oldItems = $scope.items;
    //    logViewerFactory.GetClaimEventById(params, function (data, status) {
    //        $scope.loadingContent = false;
    //        if (status == 204) {
    //            $scope.loadedLogs = true;
    //            $scope.noRecord = true;

    //        }
    //        if (status == 200) {
    //            $scope.status = true;
    //            $scope.items = data;

    //            if ($scope.items.length > 0) {

    //                if ($scope.items[0].Event) {
    //                    $scope.showDamagedVehicleTable = false;
    //                    $scope.showClaimEvent = true;
    //                }
    //                else {
    //                    $scope.showClaimEvent = false;
    //                    $scope.showDamagedVehicleTable = true;
    //                    $scope.hasMultipleERows = true;
    //                }
    //            }
    //            else {
    //                $scope.showClaimEvent = false;
    //                $scope.showDamagedVehicleTable = true;
    //            }
    //            $scope.loadedLogs = true;
    //            $scope.totalItems = data.TotalRows;
    //            $scope.resultPerPage = 500;
    //        }
    //    });
    //};

    $scope.backInAttachments = function () {
        $scope.showBack = false;
        $scope.claimForAttachments = $scope.OldClaimForAttachments;
        $scope.noAttachmentsFound = false;
        $scope.multipleClaimsForAttachmentsFound = true;
    };

    $scope.loadAttachments = function (claimNo) {
        $scope.makeActiveTab("attachments");
        if ($scope.message.ClaimNumber == 'NO_CLAIM_NUMBER') {
            $scope.noClaimNo = true;
            return;
        }
        $scope.noAttachmentsFound = false;
        $scope.showBack = false;
        $scope.loadingAttachments = true;

        var params = {
            env: parentValues.env
        };

        if (claimNo) {
            params.id = claimNo;
            $scope.showBack = true;
            $scope.OldClaimForAttachments = $scope.claimForAttachments;
        }
        else {
            params.claimNumber = $scope.message.ClaimNumber
        }

        logViewerFactory.GetAttachments(params, function (data, status) {

            $scope.loadingAttachments = false;
            if (status === 204) {
                $scope.noAttachmentsFound = true;
            } else if (status === 200 && data.isAttachments === true) {
                $scope.noAttachmentsFound = false;
                $scope.attachments = data.attachments;

                for (var i = 0; i < $scope.attachments.length; i++) {
                    $scope.attachments[i].Attachment = "/WebApi/api/attachments?env=" + parentValues.env + "&id=" + $scope.attachments[i].ClaimPK + "&wipk=" + $scope.attachments[i].WorkItem
                }
                $scope.multipleClaimsForAttachmentsFound = false;
            } else {
                $scope.noAttachmentsFound = false;
                $scope.multipleClaimsForAttachmentsFound = true;
                $scope.claimForAttachments = data;
            };
        });
    };

    $scope.loadComments = function (claimNo) {
        $scope.makeActiveTab("comments");
        if ($scope.message.ClaimNumber == 'NO_CLAIM_NUMBER') {
            $scope.noClaimNo = true;
            return;
        }

        $scope.noCommentsFound = false;
        $scope.showBack = false;
        $scope.loadingComments = true;
        var params = {
            env: parentValues.env
        };
        if (claimNo) {
            params.claimId = claimNo;
            $scope.showBack = true;
            $scope.OldClaimForComments = $scope.claimForComments;
        }
        else {
            params.claimNumber = $scope.message.ClaimNumber
        }

        logViewerFactory.GetComments(params, function (data, status) {
            $scope.loadingComments = false;
            if (status === 204) {
                $scope.noCommentsFound = true;
            } else if (status === 200 && data.isComments === true) {
                $scope.noCommentsFound = false;
                $scope.comments = data.comments;
                $scope.multipleClaimsForCommentsFound = false;
            } else {
                $scope.noCommentsFound = false;
                $scope.multipleClaimsForCommentsFound = true;
                $scope.claimForComments = data;
            };

        });
    };

    $scope.backToMultipleCommentClaim = function () {
        $scope.showBack = false;
        $scope.claimForComments = $scope.OldClaimForComments;
        $scope.noCommentsFound = false;
        $scope.multipleClaimsForCommentsFound = true;
    };

    $scope.loadRawData = function (claimNo) {
        $scope.makeActiveTab("rawdata");
        if ($scope.message.ClaimNumber == 'NO_CLAIM_NUMBER') {
            $scope.noClaimNo = true;
            return;
        }

        $scope.noRawDataFound = false;
        $scope.showBack = false;
        $scope.loadingRawData = true;
        var params = {
            env: parentValues.env
        };
        if (claimNo) {
            params.claimId = claimNo;
            $scope.showBack = true;
            $scope.OldClaimForRawData = $scope.claimForRawData;
        }
        else {
            params.claimNumber = $scope.message.ClaimNumber
        }

        logViewerFactory.GetClaimRawData(params, function (data, status) {
            $scope.loadingRawData = false;
            if (status === 204) {
                $scope.noRawDataFound = true;
            } else if (status === 200 && data.isRawData === true) {
                $scope.noRawDataFound = false;
                $scope.rawdata = data.rawdata;
                $scope.multipleClaimsForRawDataFound = false;
            } else {
                $scope.noRawDataFound = false;
                $scope.multipleClaimsForRawDataFound = true;
                $scope.claimForRawData = data;
            };
        });
    };

    $scope.backInRawData = function () {
        $scope.showBack = false;
        $scope.claimForRawData = $scope.OldClaimForRawData;
        $scope.noRawDataFound = false;
        $scope.multipleClaimsForRawDataFound = true;
    };

    $scope.backInEData = function () {
        $scope.showBack = false;
        $scope.claimForEvents = $scope.OldClaimForEvents;
        $scope.noEventsFound = false;
        $scope.multipleClaimsForEventsFound = true;
    };

    $scope.loadEvents = function (claimNo) {
        $scope.makeActiveTab("events");
        if ($scope.message.ClaimNumber == 'NO_CLAIM_NUMBER') {
            $scope.noClaimNo = true;
            return;
        }

        $scope.noEventsFound = false;
        $scope.showBack = false;
        $scope.loadingEvents = true;
        var params = {
            env: parentValues.env
        };
        if (claimNo) {
            params.claimId = claimNo;
            $scope.showBack = true;
            $scope.OldClaimForEvents = $scope.claimForEvents;
        }
        else {
            params.claimNumber = $scope.message.ClaimNumber
        }

        logViewerFactory.GetClaimEvent(params, function (data, status) {
            $scope.loadingEvents = false;
            if (status === 204) {
                $scope.noEventsFound = true;
            } else if (status === 200 && data.isEvents === true) {
                $scope.noEventsFound = false;
                $scope.events = data.events;
                $scope.multipleClaimsForEventsFound = false;
            } else {
                $scope.noEventsFound = false;
                $scope.multipleClaimsForEventsFound = true;
                $scope.claimForEvents = data;
            };

        });
    }

    $scope.IntroOptions = {
        steps: [
        {
            element: '#messageContent',
            intro: "First tooltip"
        },
        {
            element: '#step4',
            intro: "Second tooltip",
            position: 'right'
        }]
    };

    $scope.loadLogs = function (page) {
        $scope.makeActiveTab("logs");
        $scope.popupPanel = 'message';
        if (page === 0 && $scope.items.TotalPages != 'undefined' && $scope.items.TotalPages > 0)
            return;
        var params = {
            page: page,
            pageSize: 500,
            environment: parentValues.env,
            searchType: "GUID",
            searchParameter: $scope.message.GUID
        };

        if ($scope.message.GUID === 'NO_GUID') {
            $scope.msg = 'GUID is invalid or not present';
            $scope.loadingContent = false;
            return;
        }
        $scope.loadingContent = true;
        $scope.status = false;
        logViewerFactory.GetApplicationExecutionLog(params, function (data, status) {
            $scope.loadingContent = false;
            if (status == 200) {
                $scope.status = true;
                $scope.items = data;
                $scope.loadedLogs = true;
                $scope.totalItems = data.TotalRows;
                $scope.resultPerPage = 500;
            }
        });
    };

    var serviceParams = {
        id: $scope.message.Id,
        env: parentValues.env
    };
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.makeActiveTab = function (tab) {
        switch (tab) {
            case "messages":
                $scope.messageClass = "activetab";
                $scope.rawDataClass = "";
                $scope.eventClass = "";
                $scope.attachmentsClass = "";
                $scope.commentsClass = "";
                $scope.logsClass = "";
                break;
            case "rawdata":
                $scope.messageClass = "";
                $scope.rawDataClass = "activetab";
                $scope.eventClass = "";
                $scope.attachmentsClass = "";
                $scope.commentsClass = "";
                $scope.logsClass = "";
                break;
            case "events":
                $scope.messageClass = "";
                $scope.rawDataClass = "";
                $scope.eventClass = "activetab";
                $scope.attachmentsClass = "";
                $scope.commentsClass = "";
                $scope.logsClass = "";
                break;
            case "comments":
                $scope.messageClass = "";
                $scope.rawDataClass = "";
                $scope.eventClass = "";
                $scope.attachmentsClass = "";
                $scope.commentsClass = "activetab";
                $scope.logsClass = "";
                break;
            case "attachments":
                $scope.messageClass = "";
                $scope.rawDataClass = "";
                $scope.eventClass = "";
                $scope.attachmentsClass = "activetab";
                $scope.commentsClass = "";
                $scope.logsClass = "";
                break;
            case "logs":
                $scope.messageClass = "";
                $scope.rawDataClass = "";
                $scope.eventClass = "";
                $scope.attachmentsClass = "";
                $scope.commentsClass = "";
                $scope.logsClass = "activetab";
                break;
            default:

        }

    };
    $scope.viewReportAgain = function () {

        var rptWin = window.open('report.html');
        if (rptWin === 'undefined' || rptWin === undefined || rptWin === 'null' || rptWin === null) {
            var error = {};
            error.message = "You have still disabled popup, please enable popup for this website to view report";
            error.type = "danger";
            error.title = "Error";
            logViewerFactory.showDialog(error);
        }
        else {
            rptWin.report = $scope.report;
            rptWin.env = $scope.environment;
            rptWin.ReprocessedDate = $scope.ReprocessedDate;
        }

    };
    $scope.messageClass = "activetab";
    $scope.reprocessed = false;
    $scope.no = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.reprocessYes = "Yes";
    $scope.yes = function (XmlContent) {

        if ($scope.reprocessYes === "View Report") {
            $scope.viewReportAgain();
            return;
        }
        $scope.reprocessYes = "Reprocessing...";

        var params = {
            environment: $scope.environment,
            message: XmlContent,
            queue: $scope.message.MessageType,
            messageId: $scope.message.Id,
            messages: $scope.messages
        }
        logViewerFactory.ReprocessMessage(params, function (data, status) {
            $scope.reprocessYes = "View Report";
            if (data) {
                $scope.status = true;

                if (status == 200) {
                    var rptWin = window.open('report.html');
                    if (rptWin === 'undefined' || rptWin === undefined || rptWin === 'null' || rptWin === null) {
                        var error = {};
                        error.message = "You have disabled popup, please enable popup for this website to view report";
                        error.type = "danger";
                        error.title = "Error";
                        logViewerFactory.showDialog(error);
                        $scope.report[0] = $scope.message;
                        $scope.ReprocessedDate = new Date();
                        $scope.blocked = true;
                    }
                    else {
                        rptWin.report = [];
                        rptWin.report[0] = $scope.message;
                        rptWin.result = data;
                        rptWin.env = $scope.environment;
                        rptWin.ReprocessedDate = new Date();
                        $scope.report[0] = $scope.message;
                        $scope.ReprocessedDate = new Date();
                        $scope.blocked = false;
                    }
                    $scope.statusSuccess = true;
                    $scope.data = data;
                    $scope.reprocessed = true;
                    $scope.reprocessSuccess = false;
                }
                else {
                    $scope.reprocessed = true;
                    $scope.confirmation = false;
                }
            }
            else {
                $scope.status = false;
            }
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

    $scope.currentPage = 0;

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    $scope.changePage = function (page) {
        $scope.loadLogs(page);
    };

    $scope.isDisabled = false;
    $scope.no = function () {

        $scope.confirmation = false;
    };

    $scope.loadLogin = function () {
        $modalInstance.dismiss('cancel');
        $location.path("/login");
    };

    $scope.edit = false;
    $scope.getXmlContent = function (serviceParams) {
        $scope.loadingXmlContent = true;
        logViewerFactory.GetXmlContent(serviceParams, function (data, status) {
            $scope.loadingXmlContent = false;
            if (status == 200) {
                $scope.XmlContent = data.XmlMessage || "Request Failed";
                $scope.status = status;
            }
        });
    };
    $scope.getXmlContent(serviceParams);
};
