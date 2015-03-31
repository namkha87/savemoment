'use strict';

/*global chrome, util*/

var settings = null,
    widgets = [],
    config = {},
    data = {};

(function (_widgets, _config) {

    var default_to_true = function (obj, key) {
            if (typeof obj[key] === 'undefined') {
                obj[key] = true;
            }
        },

        keys = ['widget_position'];

    _config.twitch_client_id = 'e91j4e8skt2zjz7mwc6s99fv8tzt0h6';
    _config.server_ip_add = 'https://www.you1tube.com';
    _config.assets_url = 'https://s3.amazonaws.com/heartbeat.asset/';
    _config.version_name = 'Pick a winner';
    _config.version = '1.44';

    _widgets.all = function () {
        var len = this.length,
            fn = arguments[0];

        while (len--) {
            if (_widgets[len][fn]) {
                _widgets[len][fn].apply(_widgets[len], arguments[1]);
            }
        }
    };


    chrome.storage.sync.get(null, function (_settings) {

        if (!_settings) {
            _settings = {};

            keys.forEach(function (key) {
                key = key.replace('!', '');
                if (localStorage.getItem('freedom_' + key)) {
                    _settings[key] = localStorage.getItem('freedom_' + key) !== 'false';
                    localStorage.removeItem('freedom_' + key);
                }
            });
        }

        _settings.save = function () {
            chrome.storage.sync.set(JSON.parse(JSON.stringify(this)), function () {
                if (!chrome.runtime.lastError) {
                    // console.log('save successful')
                }
            });
        };

        _settings.set = function (key, value) {
            this[key] = value;
            this.save();
        };

        _settings.refresh = function (cb) {
            chrome.storage.sync.get(null, function (_settings) {
                settings = util.extend(settings, _settings);
                cb();
            });
        };

        keys.forEach(function (key) {
            if (key[0] === '!') {
                key = key.slice(1);
                if (typeof _settings[key] === 'undefined') {
                    _settings[key] = false;
                }
            }
            else if (key === 'widget_position') {
                if (typeof _settings[key] === 'undefined') {
                    _settings[key] = 'sb-button-notify';
                }
            }
            else {
                default_to_true(_settings, key);
            }
        });

        _settings.save();

        settings = _settings;
    });

})(widgets, config);
