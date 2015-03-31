(function () {
    var start = function () {
            var temp = setInterval(function () {
                if (settings) {
                    clearInterval(temp);
                    listen_on_settings_change();
                }
            }, 10);
        },

        listen_on_settings_change = function () {
            chrome.storage.onChanged.addListener(function (changes) {
                settings.refresh(function () {
                    widgets.all('settings_changed', [changes]);
                });
            });

            widgets.forEach(function (widgt) {
                var key;
                for (key in widgt) {
                    if (typeof widgt[key] === 'function') {
                        widgt[key] = widgt[key].bind(widgt);
                    }
                }
            });

            initialize_widgets();
        },

        initialize_widgets = function () {
            var temp;

            if (!widgets.length) {
                return;
            }

            widgets.all('initialize');

            temp = setInterval(function () {
                if (document.readyState === 'interactive' || document.readyState === 'complete') {
                    clearInterval(temp);
                    restart();
                    listen_href_change();
                }
            }, 100);
        },

        restart = function () {
            config.state = 'start';
            get_page_data();
            widgets.all('start');
        },

        get_page_data = function () {
            var profile_div,
                vars = {},
                page;

            if (location.hostname !== 'www.youtube.com') {
                return;
            }

            page = util.retrieve_window_variables({
                page: 'yt.config_.PAGE_NAME'
            }).page;

            if (page === 'watch') {
                vars = util.retrieve_window_variables({
                    video_id: 'yt.config_.VIDEO_ID',
                    user_country: 'yt.config_.INNERTUBE_CONTEXT_GL',
                    monetizer: 'ytplayer.config.args.ptk',
                    channel_id: 'ytplayer.config.args.ucid',
                    author: 'ytplayer.config.args.author',
                    user_age: 'ytplayer.config.args.user_age',
                    keywords: 'ytplayer.config.args.keywords',
                    views: 'ytplayer.config.args.view_count',
                    user_gender: 'ytplayer.config.args.user_gender',
                    user_name: 'ytplayer.config.args.user_display_name',
                    user_img: 'ytplayer.config.args.user_display_image'
                });

                vars.keywords = vars.keywords.split(',');
                vars.monetizer = decodeURIComponent(vars.monetizer)
                    .replace('+user', '');
                vars.username = util.$('.yt-user-photo')[0].href.split('/')[4];
            }

            if (page === 'channel') {
                vars = util.retrieve_window_variables({
                    channel_id: 'yt.config_.CHANNEL_ID',
                    user_country: 'yt.config_.INNERTUBE_CONTEXT_GL'
                });
                vars.username = util.$('.branded-page-header-title-link')[0].href.split('/')[4];
            }

            profile_div = util.$('.yt-masthead-picker-active-account');

            vars.email = profile_div.length ? profile_div[0].childNodes[0].data.trim() : null;

            data = vars;
            data.page = page;
        },

        listen_href_change = function () {
            var href = location.href,
                again = false,
                init = true;

            setInterval(function () {
                if (href !== location.href) {
                    if (init) {
                        init = false;
                        config.state = 'initialize';
                        widgets.all('initialize');
                        // console.log('href changed', location.href);
                    }

                    if (~document.body.className.indexOf('page-loaded') && again) {
                        again = false;
                        restart();
                        init = true;
                        href = location.href;
                    }
                    else if (!~document.body.className.indexOf('page-loaded')) {
                        again = true;
                    }
                }
            }, 100);

            health_check();
        },

        health_check = function () {
            setInterval(function () {
                widgets.forEach(function (widget) {
                    if (widget.show && widget.container && !util.$(widget.container) && widget.render) {
                        widget.render();
                    }

                    if (widget.integrity && !widget.integrity()) {
                        widget.initialize();
                        if (widget.start) {
                            widget.start();
                        }
                    }
                });
            }, 3000);
        };

    start();
}())
