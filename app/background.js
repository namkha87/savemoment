var google = new GoogleResource();

(function (app) {
    app.controller("BackgroundController", function ($scope, $q, youtubeService) {
        var vm = this;

        vm.anonymousApiHandler = {
            login: handleLogin,
            isUserLogined: handleIsUserLogined,
            logout: handleLogout
        };

        vm.authorizedApiHandler = {
            login: handleLogin,
            logout: handleLogout,
            getPlaylists: handleGetPlaylists,
            addPlaylist: handleAddPlaylist,
            addPlaylistItem: handleAddPlaylistItem,
            removePlaylistItem: handleRemovePlaylistItem,
            getUserInfo: handleGetUserInfo
        };

        activate();

        function activate() {
            vm.hasAccessToken = google.hasAccessToken();

            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                var apiName = request.action;
                if (!apiName) {
                    return;
                }

                // anonymous api
                if (vm.anonymousApiHandler[apiName]) {
                    vm.anonymousApiHandler[apiName](request, sender, sendResponse);
                    return true;
                }
                
                // authorized api
                if (vm.authorizedApiHandler[apiName]) {
                    // force login
                    if (!vm.hasAccessToken) {
                        login().then(function () {
                            vm.authorizedApiHandler[apiName](request, sender, sendResponse);
                        }, function () {
                            sendResponse({ success: false, error: "Cannot login to your Google account." });
                        });
                    }
                    else {
                        vm.authorizedApiHandler[apiName](request, sender, sendResponse);
                    }
                    
                    return true;
                }
            });

            chrome.tabs.onUpdated.addListener(function (tabId) {
                chrome.tabs.getSelected(null, function (tab) {
                    var extId = chrome.runtime.id;

                    if (tab.url.search('youtube') > -1) { //this means a video is playing
                        var vId = getParameterByName('v', tab.url);

                        if (vId !== '') {
                            chrome.pageAction.show(tabId);
                        }
                    }
                    else {
                        chrome.pageAction.hide(tabId);
                    }
                });
            });
        }

        function handleIsUserLogined(request, sender, sendResponse) {
            sendResponse({ data: vm.hasAccessToken });
        }

        function handleGetUserInfo(request, sender, sendResponse) {
            youtubeService.getUserInfo().then(function (data) {
                sendResponse({ success: true, data: data });
            }, function (result) {
                sendResponse({ success: false, error: result.msg });
            });
        }

        function handleGetPlaylists(request, sender, sendResponse) {
            var videoId = request.data.videoId;

            youtubeService.getPlayLists().then(function (data) {
                var playlists = [];
                angular.forEach(data.items, function (pl) {
                    playlists.push({
                        id: pl.id,
                        title: pl.snippet.title,
                        privacyStatus: pl.status ? pl.status.privacyStatus : ""
                    });
                });

                sendResponse({ data: playlists });
            }, function (result) {
                var error = result.msg;
                if (result.status == 404) {
                    error = "Please setup your channel to continue.";
                }
                else if (result.status == 403) {
                    error = "Your channel has been closed or suspended.";
                }

                sendResponse({ success: false, error: error });
            });
        }

        function handleAddPlaylist(request, sender, sendResponse) {
            // format the input
            var input = {
                snippet: {
                    title: request.data.title
                },
                status: {
                    privacyStatus: request.data.privacyStatus
                }
            };

            youtubeService.addPlayList(input).then(function (playlistData) {
                sendResponse({ success: true, data: playlistData });
            }, function (result) {
                sendResponse({ success: false, error: "Cannot add playlist:" + result.msg });
            });
        }

        function handleAddPlaylistItem(request, sender, sendResponse) {
            var videoInput = {
                snippet: {
                    playlistId: request.data.playlistId,
                    resourceId: {
                        videoId: request.data.videoId,
                        kind: "youtube#video"
                    }
                },
                contentDetails: {
                    videoId: request.data.videoId
                }
            };
            if (request.data.startAt) {
                videoInput.contentDetails.startAt = new moment.duration(request.data.startAt, 'seconds').toISOString();
            }
            if (request.data.endAt) {
                videoInput.contentDetails.endAt = new moment.duration(request.data.endAt, 'seconds').toISOString();
            }

            youtubeService.addPlaylistItem(videoInput).then(function (playlistitemData) {
                sendResponse({ success: true, data: playlistitemData });
            }, function (result) {
                sendResponse({ success: false, error: "Cannot add playlist item:" + result.msg });
            });
        }

        function handleRemovePlaylistItem(request, sender, sendResponse) {
            youtubeService.removePlaylistItem(request.id).then(function (data) {
                sendResponse({ success: true, data: data });
            }, function (result) {
                sendResponse({ success: false, error: "Cannot add playlist item:" + result.msg });
            });
        }

        function handleLogin(request, sender, sendResponse){
            login().then(function () {
                sendResponse({ success: true });
            }, function () {
                sendResponse({ success: false });
            });
        }

        function handleLogout(request, sender, sendResponse){
            logout().then(function () {
                sendResponse({ success: true });
            }, function () {
                sendResponse({ success: false });
            });
        }

        function login() {
            var defer = $q.defer();

            google.authorize(function (err, token) {
                if (err) {
                    $scope.$apply(function () {
                        defer.reject();
                    });
                }
                else {
                    $scope.$apply(function () {
                        vm.hasAccessToken = true;
                        defer.resolve();
                    });
                }
            });

            return defer.promise;
        }

        function logout() {
            var defer = $q.defer();

            google.clearAccessToken(function (err, token) {
                if (err) {
                    $scope.$apply(function () {
                        defer.reject();
                    });
                    return;
                }
                $scope.$apply(function () {
                    vm.hasAccessToken = false;
                    defer.resolve();
                });
                return;
            });

            return defer.promise;
        }

        function getParameterByName(name, url) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&#]" + name + "=([^&#]*)"),
                results = regex.exec(url);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    });
}(angular.module("saveAMomentApp")));