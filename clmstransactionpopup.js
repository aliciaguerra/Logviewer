var CLMSTransactionMessageCtrl = function ($scope, $modalInstance, $location, $http, $modal, parentValues, logViewerFactory) {
    $scope.message = parentValues.message; 
    $scope.environment = parentValues.env;  
    $scope.popupPanel = 'events';    
        
    $scope.backInAttachments = function () {
        $scope.showBack = false;
        $scope.claimForAttachments = $scope.OldClaimForAttachments;
        $scope.noAttachmentsFound = false;
        $scope.multipleClaimsForAttachmentsFound = true;
    };

    $scope.loadAttachments = function (claimNo) {
        $scope.makeActiveTab("attachments");
        if ($scope.message.ClaimNbr == 'NO_CLAIM_NUMBER') {
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
            params.claimNumber = $scope.message.ClaimNbr
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
        if ($scope.message.ClaimNbr == 'NO_CLAIM_NUMBER') {
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
            params.claimNumber = $scope.message.ClaimNbr
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
        if ($scope.message.ClaimNbr == 'NO_CLAIM_NUMBER') {
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
            params.claimNumber = $scope.message.ClaimNbr
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
        if ($scope.message.ClaimNbr == 'NO_CLAIM_NUMBER') {
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
            params.claimNumber = claimNo;          
            $scope.OldClaimForEvents = $scope.claimForEvents;
        }
        else {
            params.claimNumber = $scope.message.ClaimNbr
        }

        logViewerFactory.GetClaimEvent(params, function (data, status) {
            $scope.loadingEvents = false;
            if (status === 204) {
                $scope.noEventsFound = true;
            } else if (status === 200 && data.isEvents === true) {
                $scope.noEventsFound = false;
                $scope.events = data.events;
                $scope.multipleClaimsForEventsFound = false;
                $scope.showBack = false;
            } else {
                $scope.noEventsFound = false;
                $scope.multipleClaimsForEventsFound = true;
                $scope.claimForEvents = data;
                $scope.showBack = true;
            };

        });
    }
    
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.makeActiveTab = function (tab) {
        switch (tab) {
           
            case "events":               
                $scope.rawDataClass = "";
                $scope.eventClass = "activetab";
                $scope.attachmentsClass = "";
                $scope.commentsClass = "";              
                break;
            case "comments":               
                $scope.rawDataClass = "";
                $scope.eventClass = "";
                $scope.attachmentsClass = "";
                $scope.commentsClass = "activetab";              
                break;
            case "attachments":              
                $scope.rawDataClass = "";
                $scope.eventClass = "";
                $scope.attachmentsClass = "activetab";
                $scope.commentsClass = "";              
                break;
            case "rawdata":             
                $scope.rawDataClass = "activetab";
                $scope.eventClass = "";
                $scope.attachmentsClass = "";
                $scope.commentsClass = "";            
                break;
            default:

        }

    };
    $scope.makeActiveTab("events");
    $scope.loadEvents($scope.message.ClaimNbr);
    $scope.popupPanel = 'events';

    $scope.no = function () {
        $modalInstance.dismiss('cancel');
    };
    
};
