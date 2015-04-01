'use strict';

/*globals config, widgets, settings, util, jsonToDOM*/
/*
    Light switch widget
    //https://jsfiddle.net/e97pbuwo/
*/

(function () {

    var widget = {

        name: 'Save moment',

        urls: [
            /^https:\/\/www.youtube.com/
        ],

        container: '#save_a_moment_container',
        popup_selector: '#save_moment_popup',
        new_playlist_name_selector: '#save_moment_new_play_plist_name',
        add_new_playlist_button_selector: '#save_moment_add_new_playlist_button',
        privacy_list_button_selector: '#save_moment_privacy_list_button',
        moment_start_at_value_selector: '#save_moment_start_at_value',
        moment_start_at_selector: '#save_moment_start_at',
        moment_end_at_value_selector: '#save_moment_end_at_value',
        moment_end_at_selector: '#save_moment_end_at',
        list_wrapper_selector: '#save_moment_list_wrapper',
        add_new_playlist_selector: '#save_moment_add_new_playlist',
        create_playlist_section_selector: '#save_moment_create_playlist_section',
        privacy_list_menu_selector: '#save_moment_privacy_list_menu',

        range_slider_thumb_width: 22,

        initialize: function () {
            var self = this;

            if (self.show) {
                return;
            }

            self.save_a_moment_dom = jsonToDOM([
                "div",
                {
                    id: self.container.slice(1),
                    class: "yt-uix-menu"
                },
                    [
                        "div",
                        {
                            class: "yt-uix-menu-trigger",
                        },
                        [
                            "button",
                            {
                                class: "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup yt-uix-videoactionmenu-button addto-button yt-uix-tooltip yt-uix-button-toggled",
                                id: "save_moment_button",
                                "data-tooltip-text": "Save your favorite moment",
                                style: "margin-right: 10px"
                            },
                            ["span", {}, "Save moment"]
                        ]
                    ],
                    [
                        "div",
                        {
                            "id": "save_moment_popup"
                        },
                        [
                            "h3",
                            {
                                "style": "text-align: center"
                            },
                            "Pick a moment"
                        ],
                        [
                            "div",
                            {
                                "class": "save_moment_pick_a_moment_wrapper"
                            },
                            [
                                "section",
                                {
                                    "class": "range_slider_value"
                                },
                                [
                                    "label",
                                    {
                                        "id": "save_moment_start_at_value",
                                    },
                                    "0"
                                ],
                                [
                                    "label",
                                    {
                                        "id": "save_moment_end_at_value",
                                    },
                                    "0"
                                ]
                            ],
                            [
                                "section",
                                {
                                    "class": "range_slider"
                                },
                                [
                                    "input",
                                    {
                                        "id": "save_moment_start_at",
                                        "type": "range",
                                        "min": "0"
                                    },
                                    ""
                                ],
                                [
                                    "input",
                                    {
                                        "id": "save_moment_end_at",
                                        "type": "range",
                                        "min": "0"
                                    },
                                    ""
                                ]
                            ],
                            [
                                "section",
                                {
                                    "class": "save_moment_player"
                                },
                                [
                                    "button",
                                    {
                                        "id": "save_moment_btn_play",
                                    },
                                    [
                                        "span",
                                        {
                                            "class": "icon",
                                        },
                                        ""
                                    ],
                                    [
                                        "span",
                                        {
                                            "class": "play",
                                        },
                                        "Play"
                                    ],
                                    [
                                        "span",
                                        {
                                            "class": "stop",
                                        },
                                        "Stop"
                                    ]
                                ]
                            ]
                        ],
                        [
                            "p",
                            {
                                class: "add_to_playlist_title",
                            },
                            "Add selected moment to a playlist"
                        ],
                        [
                            "div",
                            {
                                "id": "save_moment_list_wrapper"
                            },
                            [
                                "ul",
                                {
                                    "role": "menu",
                                    "tabindex": "0",
                                    "id": "play_list_container",
                                    "class": "yt-uix-kbd-nav yt-uix-kbd-nav-list"
                                },
                                ""
                            ]
                        ],
                        [
                            "button",
                            {
                                "id": "save_moment_add_new_playlist"
                            },
                            [
                                "span",
                                {
                                },
                                "+ Add playlist"
                            ]
                        ],
                        [
                            "div",
                            {
                                "id": "save_moment_create_playlist_section",
                                "style": "display: none"
                            },
                            [
                                "div",
                                {
                                    "style": "margin-bottom: 15px"
                                },
                                [
                                    "span",
                                    {
                                        "class": "title-input-container yt-uix-form-input-container yt-uix-form-input-text-container  yt-uix-form-input-fluid-container"
                                    },
                                    [
                                        "span",
                                        {
                                            "class": " yt-uix-form-input-fluid"
                                        },
                                        [
                                            "input",
                                            {
                                                "id": "save_moment_new_play_plist_name",
                                                "class": "yt-uix-form-input-text title-input",
                                                "name": "n",
                                                "type": "text",
                                                "maxlength": "150",
                                                "title": "Enter a title for a new playlist"
                                            },
                                            ""
                                        ]
                                    ]
                                ]
                            ],
                            [
                                "div",
                                {
                                    "class": "clearfix"
                                },
                                [
                                    "div",
                                    {
                                        "class": "create-playlist-buttons"
                                    },
                                    [
                                        "button",
                                        {
                                            "id": "save_moment_add_new_playlist_button",
                                            "class": "yt-uix-button yt-uix-button-size-default yt-uix-button-primary disabled",
                                            "type": "button",
                                            "disabled": ""
                                        },
                                        [
                                            "span",
                                            {
                                                "class": "yt-uix-button-content disabled"
                                            },
                                            "Create"
                                        ]
                                    ]
                                ],
                                [
                                    "input",
                                    {
                                        "class": "privacy-value-input",
                                        "type": "hidden",
                                        "name": "p",
                                        "value": "public"
                                    },
                                    ""
                                ],
                                [
                                    "button",
                                    {
                                        "id": "save_moment_privacy_list_button",
                                        "aria-expanded": "false",
                                        "type": "button",
                                        "class": "yt-uix-button yt-uix-button-default yt-uix-button-size-default yt-uix-button-has-icon no-icon-markup",
                                        "aria-haspopup": "true",
                                        "data-button-menu-indicate-selected": "true",
                                        "data-button-has-sibling-menu": "true"
                                    },
                                    [
                                        "span",
                                        {
                                            "class": "yt-uix-button-content"
                                        },
                                        "Public"
                                    ],
                                    [
                                        "span",
                                        {
                                            "class": "yt-uix-button-arrow yt-sprite"
                                        },
                                        ""
                                    ],
                                    [
                                        "div",
                                        {
                                            "id": "save_moment_privacy_list_menu",
                                            "class": "yt-uix-button-menu yt-uix-button-menu-default",
                                            "style": "display: none"
                                        },
                                        [
                                            "ul",
                                            {
                                                "class": "create_playlist_widget_privacy_menu yt-uix-kbd-nav yt-uix-kbd-nav-list",
                                                "tabindex": "0"
                                            },
                                            [
                                                "li",
                                                {
                                                    "role": "menuitem",
                                                    "data-value": "public",
                                                    "data-text": "Public",
                                                    "class": "privacy-option selected"
                                                },
                                                [
                                                    "span",
                                                    {
                                                        "class": "yt-uix-button-menu-item"
                                                    },
                                                    "Public"
                                                ]
                                            ],
                                            [
                                                "li",
                                                {
                                                    "role": "menuitem",
                                                    "data-value": "unlisted",
                                                    "data-text": "Unlisted",
                                                    "class": "privacy-option"
                                                },
                                                [
                                                    "span",
                                                    {
                                                        "class": "yt-uix-button-menu-item"
                                                    },
                                                    "Unlisted"
                                                ]
                                            ],
                                            [
                                                "li",
                                                {
                                                    "role": "menuitem",
                                                    "data-value": "private",
                                                    "data-text": "Private",
                                                    "class": "privacy-option"
                                                },
                                                [
                                                    "span",
                                                    {
                                                        "class": "yt-uix-button-menu-item"
                                                    },
                                                    "Private"
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
            ], document, {});

            self.listen_events();
        },

        start: function () {
            if (this.show) {
                return;
            }
            this.render();
        },

        close_save_popup: function () {
            util.$(this.popup_selector).hide();
            document.removeEventListener('click', this.close_save_popup);
        },

        // user select a playlist -> add the video to it
        select_playlist: function (evt) {
            var self = this,
                playlistId = evt.currentTarget.getAttribute("playlist-id"),
                playlistTitle = evt.currentTarget.getAttribute("playlist-title"),
                moment_start_at = util.$(self.moment_start_at_selector, self.save_a_moment_dom),
                moment_end_at = util.$(self.moment_end_at_selector, self.save_a_moment_dom);

            var input = {
                videoId: util.get_video_id_from_location(),
                playlistId: playlistId,
                playlistTitle: playlistTitle,
                // will convert to iso8601 duration string in background
                startAt: parseInt(moment_start_at.value),
                endAt: parseInt(moment_end_at.value)
            };

            self.add_video(input);
        },

        // add a video to playlist, reuse in couple places
        add_video: function (input) {
            var self = this;

            self.enable_ui(false);
            chrome.runtime.sendMessage({ action: "addPlaylistItem", data: input }, function (response) {
                if (response.success) {
                    self.close_save_popup();
                    self.show_notification("Added to playlist " + input.playlistTitle);
                }

                self.enable_ui(true);
            });
        },

        load_playlist: function () {
            var self = this,
                input = { videoId: util.get_video_id_from_location() },
                wrapper = util.$(self.list_wrapper_selector, self.save_a_moment_dom);
            if (!wrapper) {
                return;
            }

            wrapper.replace(jsonToDOM([
                "span", { class: "loading" }, "Loading..."
            ], document, {}));

            chrome.runtime.sendMessage({ action: "getPlaylists", data: input }, function (response) {
                var error = "";

                if (!response.data) {
                    error = response.error ? response.error : "Cannot load your playlists.";

                    wrapper.replace(jsonToDOM([
                        "span", { class: "loading" }, error
                    ], document, {}));
                    //self.close_save_popup();
                    return;
                }

                self.playlists = response.data;
                self.render_playlist(response.data);
            });
        },

        render_playlist: function (data) {
            var self = this,
                wrapper = util.$(self.list_wrapper_selector, self.save_a_moment_dom),
                playListContainer = [
                    "ul",
                    {
                        "role": "menu",
                        "tabindex": "0",
                        "class": "yt-uix-kbd-nav yt-uix-kbd-nav-list"
                    }
                ];

            if (data.length == 0) {
                wrapper.replace(jsonToDOM([
               "span", { class: "loading" }, "No playlist found."
                ], document, {}));
                return;
            }

            data.forEach(function (pl) {
                var domObj = [
                    "li",
                    {
                        "class": "yt-uix-button-menu-item",
                        "title": "Click to add the moment to " + pl.title,
                        "click": self.select_playlist,
                        "playlist-id": pl.id,
                        "playlist-title": pl.title
                    }, [
                        "a",
                        {
                            "class": "playlist-status",
                            "href": "https://www.youtube.com/playlist?list=" + pl.id,
                            "title": "Click to play " + pl.title,
                            "click": function (evt) {
                                // href not work
                                evt.stopPropagation();
                                evt.preventDefault();
                                window.location = "https://www.youtube.com/playlist?list=" + pl.id;
                                return false;
                            }
                        },
                        ""
                    ], [
                        "span",
                        {
                            "class": "playlist-name"
                        },
                        pl.title
                    ], [
                        "span",
                        {
                            "class": pl.privacyStatus + "-icon yt-sprite",
                            "title": pl.privacyStatus + " playlist"
                        },
                        ""
                    ]
                ];

                playListContainer.push(domObj);
            });

            wrapper.replace(jsonToDOM(playListContainer, document, {}));
        },

        open_save_popup: function (evt) {
            var self = this;

            evt.preventDefault();
            evt.stopPropagation();

            setTimeout(function () {
                document.addEventListener('click', self.close_save_popup);
            }, 10);

            self.reset_ui();
            // load playlist as default
            self.load_playlist();
        },

        close_privacy_menu: function () {
            var self = this;

            util.$(self.privacy_list_menu_selector, self.save_a_moment_dom).hide();
            document.removeEventListener('click', self.close_privacy_menu);
        },

        open_privacy_menu: function (evt) {
            var self = this;

            evt.preventDefault();
            evt.stopPropagation();

            util.$(self.privacy_list_menu_selector).show_block();

            setTimeout(function () {
                document.addEventListener('click', self.close_privacy_menu);
            }, 10);
        },

        get_video_player: function () {
            return util.$("#player video");
        },

        reset_ui: function () {
            var self = this,
                videoPlayer = self.get_video_player(),
                moment_start_at = util.$(self.moment_start_at_selector, self.save_a_moment_dom),
                moment_end_at = util.$(self.moment_end_at_selector, self.save_a_moment_dom);

            util.$(self.popup_selector, self.save_a_moment_dom).show_block();

            // hide add new section by default
            util.$(self.create_playlist_section_selector, self.save_a_moment_dom).hide();
            util.$(self.add_new_playlist_selector, self.save_a_moment_dom).show_inline_block();

            // empty playlist name text box
            util.$(self.new_playlist_name_selector, self.save_a_moment_dom).value = "";

            // set default privacy  to public
            util.$(self.privacy_list_button_selector, self.save_a_moment_dom).value = "public";
            util.$(self.privacy_list_menu_selector + ' > ul > li.selected', self.save_a_moment_dom).remove_class("selected");
            util.$(self.privacy_list_menu_selector + ' > ul > li', self.save_a_moment_dom).add_class("selected");

            // reset range slider
            moment_start_at.setAttribute("max", videoPlayer.duration);
            moment_end_at.setAttribute("max", videoPlayer.duration);
            self.set_moment_start_at(0);
            self.set_moment_end_at(videoPlayer.duration);

            // set play button to "play"
            self.stop_playing();

            self.enable_ui(true);
        },

        set_moment_start_at: function (value) {
            var self = this,
                txt_start_val = util.$(self.moment_start_at_value_selector, self.save_a_moment_dom),
                moment_start_at = util.$(self.moment_start_at_selector, self.save_a_moment_dom);

            txt_start_val.innerText = seconds_to_text(value);
            moment_start_at.value = value;
        },

        set_moment_end_at: function (value) {
            var self = this,
                txt_end_val = util.$(self.moment_end_at_value_selector, self.save_a_moment_dom),
                moment_end_at = util.$(self.moment_end_at_selector, self.save_a_moment_dom);

            txt_end_val.innerText = seconds_to_text(value);
            moment_end_at.value = value;
        },

        enable_ui: function (enabled) {
            var self = this,
                container = util.$(self.popup_selector),
                blockUI = util.$("#save_moment_block_ui", self.save_a_moment_dom);

            if (!enabled) {
                if (blockUI) {
                    return;
                }

                blockUI = jsonToDOM([
                    "div", {
                        id: "save_moment_block_ui"
                    },
                    ""
                ], document, {});
                container.appendChild(blockUI);
            }
            else {
                if (blockUI) {
                    blockUI.remove();
                }
            }
        },

        select_privacy_status: function (evt) {
            var self = this,
                btn = util.$(self.privacy_list_button_selector, self.save_a_moment_dom),
                btnText = util.$(self.privacy_list_button_selector + ' > span.yt-uix-button-content', self.save_a_moment_dom),
                selectedItem = util.$(self.privacy_list_menu_selector + ' > ul > li.selected', self.save_a_moment_dom),
                item = evt.currentTarget;

            evt.preventDefault();
            evt.stopPropagation();
            util.bind_elem_functions(item);

            selectedItem.remove_class("selected");
            item.add_class("selected");
            btn.value = item.getAttribute("data-value");
            btnText.innerText = item.getAttribute("data-text");

            self.close_privacy_menu();
        },

        show_notification: function (text, timeout) {
            var self = this,
                wrapper = util.$("#appbar-main-guide-notification-container"),
                dom = [
                    "div",
                    {
                        "id": "heartbeat_save_a_moment_popup",
                        "class": "appbar-guide-notification ",
                        "role": "alert"
                    },
                    [
                        "span",
                        {
                            "class": "appbar-guide-notification-content-wrapper yt-valign"
                        },
                        [
                            "span",
                            {
                                "class": "appbar-guide-notification-icon yt-sprite"
                            },
                            ""
                        ],
                        [
                            "span",
                            {
                                "class": "appbar-guide-notification-text-content"
                            },
                            text
                        ]
                    ]
                ],
                body = util.$('body')[0];

            body.add_class("show-guide-button-notification");
            if (wrapper) {
                wrapper.replace(jsonToDOM(dom, document, {}));
            }

            if (self._notification_timeout) {
                clearTimeout(self._notification_timeout);
            }

            timeout = timeout ? timeout : 3000;
            self._notification_timeout = setTimeout(function () {
                body.remove_class("show-guide-button-notification");
            }, timeout);
        },

        render: function () {
            var mast = util.$('#watch8-secondary-actions'),
                self = this;
            if (mast) {
                mast.insertBefore(self.save_a_moment_dom, mast.firstElementChild);
            }
            self.show = true;
        },

        listen_events: function () {
            var self = this;

            // click on "save a moment" button will show the popup, click outside will close it
            util.$('#save_moment_button', self.save_a_moment_dom).addEventListener('click', self.open_save_popup);
            util.$(self.popup_selector, self.save_a_moment_dom).addEventListener('click', function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                self.close_privacy_menu();
            });

            // user click on add new playlist button -> show inputs for him
            util.$(self.add_new_playlist_selector, self.save_a_moment_dom).addEventListener('click', function () {
                util.$(self.create_playlist_section_selector, self.save_a_moment_dom).show_block();
                util.$(self.add_new_playlist_selector, self.save_a_moment_dom).hide();
                util.$(self.new_playlist_name_selector, self.save_a_moment_dom).focus();
                util.$(self.add_new_playlist_button_selector, self.save_a_moment_dom).setAttribute("disabled", "disabled");
            });

            // show select privacy status menu when adding new playlist
            util.$(self.privacy_list_button_selector, self.save_a_moment_dom).addEventListener('click', self.open_privacy_menu);
            //select privacy status menu item will change button value
            var privacyListItems = util.$(self.privacy_list_menu_selector + ' > ul', self.save_a_moment_dom).childNodes;
            for (var i = 0; i < privacyListItems.length; i++) {
                privacyListItems[i].addEventListener('click', self.select_privacy_status);
            }

            // user enter the playlist name -> enable add button
            util.$(self.new_playlist_name_selector, self.save_a_moment_dom).addEventListener('keyup', function () {
                var addBtn = util.$(self.add_new_playlist_button_selector, self.save_a_moment_dom),
                    name = this.value ? this.value.trim() : "";
                if (name) {
                    addBtn.remove_class("disabled").removeAttribute("disabled");
                }
                else {
                    addBtn.add_class("disabled").setAttribute("disabled", "disabled");
                }
            });

            // user click add button -> create new playlist also add the video to it
            util.$(self.add_new_playlist_button_selector, self.save_a_moment_dom).addEventListener('click', function (evt) {
                console.log(evt);
                var btnPrivacy = util.$(self.privacy_list_button_selector, self.save_a_moment_dom),
                    txtName = util.$(self.new_playlist_name_selector, self.save_a_moment_dom),
                    moment_start_at = util.$(self.moment_start_at_selector, self.save_a_moment_dom),
                    moment_end_at = util.$(self.moment_end_at_selector, self.save_a_moment_dom);

                if (!btnPrivacy || !txtName || !btnPrivacy.value || !txtName.value) {
                    return;
                }

                var input = {
                    title: txtName.value,
                    privacyStatus: btnPrivacy.value
                };

                self.enable_ui(false);
                chrome.runtime.sendMessage({ action: "addPlaylist", data: input }, function (response) {
                    if (response.success) {
                        var videoInput = {
                            videoId: util.get_video_id_from_location(),
                            playlistTitle: txtName.value,
                            playlistId: response.data.id,
                            // will convert to iso8601 duration string in background
                            startAt: parseInt(moment_start_at.value),
                            endAt: parseInt(moment_end_at.value)
                        };

                        self.add_video(videoInput);
                    }
                    else {
                        self.enable_ui(true);
                        self.close_save_popup();
                    }

                    //self.enable_ui(true);
                    //self.close_save_popup();
                });
            });

            //range slider change event handler
            util.$(self.moment_start_at_selector, self.save_a_moment_dom).addEventListener('change', function () {
                var videoPlayer = self.get_video_player(),
                    txt_start_val = util.$(self.moment_start_at_value_selector, self.save_a_moment_dom),
                    moment_start_at = util.$(self.moment_start_at_selector, self.save_a_moment_dom),
                    txt_end_val = util.$(self.moment_end_at_value_selector, self.save_a_moment_dom),
                    moment_end_at = util.$(self.moment_end_at_selector, self.save_a_moment_dom),
                    start_at = parseInt(moment_start_at.value),
                    end_at = parseInt(moment_end_at.value),
                    delta = Math.ceil(videoPlayer.duration * self.range_slider_thumb_width / moment_start_at.clientWidth);

                txt_start_val.innerText = seconds_to_text(start_at);
                if (end_at <= start_at + delta) {
                    end_at = start_at + delta > videoPlayer.duration ?
                        videoPlayer.duration : start_at + delta;
                    self.set_moment_end_at(end_at);
                }
                // seek to new position
                videoPlayer.currentTime = start_at;
                if (self.is_playing) {
                    self.stop_playing(true);
                }
            });

            util.$(self.moment_end_at_selector, self.save_a_moment_dom).addEventListener('change', function () {
                var videoPlayer = self.get_video_player(),
                    txt_start_val = util.$(self.moment_start_at_value_selector, self.save_a_moment_dom),
                    moment_start_at = util.$(self.moment_start_at_selector, self.save_a_moment_dom),
                    txt_end_val = util.$(self.moment_end_at_value_selector, self.save_a_moment_dom),
                    moment_end_at = util.$(self.moment_end_at_selector, self.save_a_moment_dom),
                    start_at = parseInt(moment_start_at.value),
                    end_at = parseInt(moment_end_at.value),
                    delta = Math.ceil(videoPlayer.duration * self.range_slider_thumb_width / moment_end_at.clientWidth);

                txt_end_val.innerText = seconds_to_text(end_at);
                if (end_at <= start_at + delta) {
                    start_at = end_at - delta < 0 ? 0 : end_at - delta;
                    self.set_moment_start_at(start_at);
                }

                // seek to new position
                videoPlayer.currentTime = end_at;
                if (self.is_playing) {
                    self.stop_playing(true);
                }
            });

            util.$("#save_moment_btn_play", self.save_a_moment_dom).addEventListener('click', function () {
                var btn_play = util.$("#save_moment_btn_play", self.save_a_moment_dom),
                    videoPlayer = self.get_video_player(),
                    moment_start_at = util.$(self.moment_start_at_selector, self.save_a_moment_dom),
                    moment_end_at = util.$(self.moment_end_at_selector, self.save_a_moment_dom),
                    start_at = parseInt(moment_start_at.value),
                    end_at = parseInt(moment_end_at.value);

                if (!self.is_playing) {
                    self.is_playing = true;
                    btn_play.add_class("playing");
                    if (self.play_timeout) {
                        clearTimeout(self.play_timeout);
                    }

                    // seek to new position
                    videoPlayer.currentTime = start_at;
                    if (videoPlayer.paused) {
                        videoPlayer.play();
                    }
                    
                    self.play_timeout = setInterval(function () {
                        if (videoPlayer.currentTime >= end_at) {
                            self.stop_playing(true);
                            videoPlayer.currentTime = end_at;
                            clearTimeout(self.play_timeout);
                        }
                    }, 500);
                }
                else {
                    self.stop_playing(true);
                }
            });
        },

        stop_playing: function(pause){
            var self = this,
                btn_play = util.$("#save_moment_btn_play", self.save_a_moment_dom),
                videoPlayer = self.get_video_player();

            if (self.play_timeout) {
                clearTimeout(self.play_timeout);
            }

            self.is_playing = false;
            if (pause) {
                videoPlayer.pause();
            }
            btn_play.remove_class("playing");
        },

        settings_changed: function (change) {
            // temporarily do nothing
        }
    };

    widgets.push(widget);

    function text_to_seconds(text) {
        var h = 0,
            m = 0,
            s = 0,
            arr = text.split(":");

        arr.reverse();

        if (arr.length >= 3) {
            h = parseInt(arr[2]);
        }
        if (arr.length >= 2) {
            m = parseInt(arr[1]);
        }
        if (arr.length >= 1) {
            s = parseInt(arr[0]);
        }

        return h * 3600 + m * 60 + s;
    }

    function pad_num2(text) {
        if (text === null || text === undefined) {
            return "";
        }

        text = text.toString();
        if (text.length < 2) {
            text = "0" + text;
        }

        return text;
    }

    function seconds_to_text(seconds) {
        var h = 0,
            m = 0,
            s = 0;

        if (typeof seconds == "string") {
            seconds = parseInt(seconds);
        }

        h = Math.floor(seconds / 3600);
        m = Math.floor((seconds - h * 3600) / 60);
        s = Math.floor(seconds - h * 3600 - m * 60);

        return (h > 0 ? pad_num2(h) + ":" : "") +
            pad_num2(m) + ":" + pad_num2(s);
    }
})();
