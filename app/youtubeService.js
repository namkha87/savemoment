(function (app) {
    app.factory("youtubeService", ['$http', '$q', function ($http, $q) {
        return {
            getPlayLists: getPlayLists,
            addPlayList: addPlayList,
            addPlaylistItem: addPlaylistItem,
            removePlaylistItem: removePlaylistItem,
            getPlaylistItems: getPlaylistItems,
            getUserInfo: getUserInfo
        };

        function getUserInfo()
        {
            var youtube = new YoutubeResource({type:"userinfo"});
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url:"https://www.googleapis.com/oauth2/v2/userinfo",
                headers:{'Content-Type':'application/data','Authorization':'Bearer '+google.getAccessToken()}
            }).success(function(data,status,headers,config){
                deferred.resolve(data,status);
            }).error(function(data,status,headers,config){
                deferred.reject({"msg":"Unable to find your account.","status":status});
            });
                
            return deferred.promise;
        }

        function getPlayLists() {
            var youtube = new YoutubeResource({ type: "listPlaylists" }),
                deferred = $q.defer();

            $http({
                method: 'GET',
                url: youtube.queryURL("snippet,status", { mine: true },
                {
                    maxResults: "50"
                }),
                headers: { 'Content-Type': 'application/data', 'Authorization': 'Bearer ' + google.getAccessToken() }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data, status);
            }).error(function (data, status, headers, config) {
                deferred.reject({ msg: "Unable to query playlist", status: status });
            });

            return deferred.promise;
        }

        function addPlayList(playlist) {
            // playlist should have following format
            //{
            //    "snippet": {
            //        "title":""
            //    }
            //    "status": {
            //        "privacyStatus":""
            //    }
            //}
            var youtube = new YoutubeResource({ type: "listPlaylists" }),
                deferred = $q.defer();

            $http({
                method: 'POST',
                url: youtube.queryURL("snippet,status", {}, {}),
                data: playlist,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + google.getAccessToken() }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data, status);
            }).error(function (data, status, headers, config) {
                deferred.reject({ msg: "Unable to add playlist ", status: status });
            });

            return deferred.promise;
        }

        
        function addPlaylistItem(playlistItem) {
            // playlist item should have following format
            //{
            //    "snippet": {
            //        "playlistId": "PLOb0Igt0_Udp4qP9eaThUN7RfSCUqy937",
            //        "resourceId": {
            //            "videoId": "ciOalICSUAo",
            //            "kind": "youtube#video"
            //        }
            //    },
            //    "contentDetails": {
            //        "videoId": "ciOalICSUAo",
            //        "startAt": "",
            //        "endAt": ""
            //    }
            //}
            var youtube = new YoutubeResource({ type: "listPlaylistItems" }),
                deferred = $q.defer();

            $http({
                method: 'POST',
                url: youtube.queryURL("contentDetails,snippet", {}, {}),
                data: playlistItem,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + google.getAccessToken() }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data, status);
            }).error(function (data, status, headers, config) {
                deferred.reject({ msg: "Unable to add playlist item", status: status });
            });

            return deferred.promise;
        }

        function removePlaylistItem(id) {
            var youtube = new YoutubeResource({ type: "listPlaylistItems" }),
                deferred = $q.defer();

            $http({
                method: 'DELETE',
                url: youtube.queryURL("contentDetails,snippet", { id: id }, {}),
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + google.getAccessToken() }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data, status);
            }).error(function (data, status, headers, config) {
                deferred.reject({ msg: "Unable to add playlist item", status: status });
            });

            return deferred.promise;
        }

        function getPlaylistItems(filter, option) {
            var youtube = new YoutubeResource({ type: "listPlaylistItems" }),
                deferred = $q.defer();

            if (!filter) {
                filter = {};
            }

            if (!option) {
                option = {};
            }

            $http({
                method: 'Get',
                url: youtube.queryURL("contentDetails,snippet", filter, option),
                headers: { 'Content-Type': 'application/data', 'Authorization': 'Bearer ' + google.getAccessToken() }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data, status);
            }).error(function (data, status, headers, config) {
                deferred.reject({ msg: "Unable to add playlist item", status: status });
            });

            return deferred.promise;
        }
    }]);
}(angular.module("saveAMomentApp")));