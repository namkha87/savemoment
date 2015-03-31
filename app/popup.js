var google = new GoogleResource();

(function (app) {
    app.controller("HomeController", ['$scope', '$q', 'youtubeService', function ($scope, $q, youtubeService) {
        var vm = this;

        vm.user = null;

        vm.login = login;
        vm.logOut = logOut;

        activate();

        function activate() {
            chrome.runtime.sendMessage({ action: "isUserLogined" }, function (response) {
                if (response.data) {
                    getUserInfo();
                }
                
                $scope.$apply(function () {
                    vm.hasAccessToken = !!response.data;
                });
            });
        }

        function getUserInfo() {
            chrome.runtime.sendMessage({ action: "getUserInfo" }, function (response) {
                $scope.$apply(function () {
                    vm.user = response.data;
                });
            });
        }

        function login() {
            chrome.runtime.sendMessage({ action: "login" }, function (response) {
                if (response.success) {
                    getUserInfo();
                    $scope.$apply(function () {
                        vm.hasAccessToken = true;
                    });
                }
                else {
                    $scope.$apply(function () { vm.message = "error happened when authorizing your Google account!"; });
                }
            });
        }

        function logOut() {
            chrome.runtime.sendMessage({ action: "logout" }, function (response) {
                if (response.success) {
                    $scope.$apply(function () {
                        vm.user = null;
                        vm.hasAccessToken = false;
                    });
                }
                else {
                    $scope.$apply(function () { vm.message = "error happened when logging out your account!"; });
                }
            });
        }
    }]);
}(angular.module("saveAMomentApp")));