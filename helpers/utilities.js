'use strict';

/*global fermata, settings, config, chrome*/

/*
    Utilities
*/

var util = (function () {

    return {

        api: fermata.json(config.server_ip_add),

        locale: function () {
            return chrome.i18n.getMessage.apply(chrome.i18n, arguments);
        },

        toggle: function (id, display) {
            var element = this.$('#' + id);
            if (element) {
                element.style.display = element.style.display === 'none' ? display || 'block' : 'none';
            }
        },

        simple_pluralize: function (string, number) {
            return this.lang === 'en' ? (number === 1 ? string : string + 's') : string;
        },

        number_with_commas: function (x) {
            return x > -1 ? (x || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'Unknown';
        },

        decode_HTML: function (string) {
            var map = {
                gt: '>',
                lt: '<',
                quot: '"',
                apos: '\''
            };

            return string.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function ($0, $1) {
                return $1[0] === '#' ? (String.fromCharCode($1[1].toLowerCase() === 'x' ? parseInt(
                    $1.substr(2), 16) : parseInt($1.substr(1), 10))) : (map.hasOwnProperty($1) ?
                    map[$1] : $0);
            });
        },

        clean_string: function (s) {
            return s.match(/\S{1,30}/g) ? s.match(/\S{1,30}/g).join(' ') : '';
        },

        $: function (s, doc) {
            var elem = s[0] === '#' ? (doc || document).querySelector(s) : (doc || document).querySelectorAll(
                    s),
                self = this;

            if (elem) {
                if (s[0] === '#') {
                    self.bind_elem_functions(elem);
                    return elem;
                }

                [].forEach.call(elem, function (el) {
                    self.bind_elem_functions(el);
                });
            }

            return elem;
        },

        bind_elem_functions: function (elem) {
            elem.replace = function (new_elem) {
                while (this.firstChild) {
                    this.removeChild(this.firstChild);
                }

                this.appendChild(new_elem);
            };

            elem.add_class = function (className) {
                if (elem.classList) {
                    elem.classList.add(className);
                }
                else {
                    elem.className += ' ' + className;
                }

                return elem;
            };

            elem.remove_class = function (className) {
                if (elem.classList) {
                    elem.classList.remove(className);
                }
                else {
                    elem.className = elem.className
                        .replace(new RegExp('(^|\\b)' + className.split(' ')
                            .join('|') + '(\\b|$)', 'gi'), ' ');
                }

                return elem;
            },

            elem.show_block = function (eventName, callback) {
                elem.style.display = "block";
                return elem;
            };

            elem.show_inline = function (eventName, callback) {
                elem.style.display = "inline";
                return elem;
            };

            elem.show_inline_block = function (eventName, callback) {
                elem.style.display = "inline-block";
                return elem;
            };

            elem.hide = function (eventName, callback) {
                elem.style.display = "none";
                return elem;
            };
        },

        $wait: function (selector, cb, time, timeout) {
            var _timeout = timeout || 5000,
                now = +new Date() + _timeout,
                i = setInterval(function () {
                    var temp = util.$(selector);

                    if (temp) {
                        clearInterval(i);
                        cb(temp);
                    }

                    if (+new Date() >= now) {
                        clearInterval(i);
                        cb(new Error('TIMEDOUT: Element not found'));
                    }
                }, time || 500);
        },

        strip: function (html) {
            return html.replace(/<(?:.|\n)*?>/gm, '');
        },

        scroll_to_element: function (pageElement) {
            var positionX = 0,
                positionY = 0;

            while (pageElement !== null) {
                positionX += pageElement.offsetLeft;
                positionY += pageElement.offsetTop;
                pageElement = pageElement.offsetParent;
                window.scrollTo(positionX, positionY);
            }
        },

        retrieve_window_variables: function (variables) {
            var scriptContent = '',
                variable,
                script,
                temp,
                i;

            for (i in variables) {
                variable = variables[i];
                scriptContent += 'if (typeof ' + variable + ' !== "undefined"){' +
                    'document.body.setAttribute("tmp_' + variable + '", ' + variable + ');}';
            }

            script = document.createElement('script');
            script.id = 'temp_script';
            script.appendChild(document.createTextNode(scriptContent));
            (document.body || document.head || document.documentElement).appendChild(script);

            for (i in variables) {
                variable = variables[i];
                variables[i] = document.body.getAttribute('tmp_' + variable);
                document.body.removeAttribute('tmp_' + variable);
            }

            temp = this.$('#temp_script');
            temp.parentElement.removeChild(temp);

            return variables;
        },

        extend: function (obj, source) {
            var prop;

            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    obj[prop] = source[prop];
                }
            }

            return obj;
        },

        stringify: function (obj) {
            var ret = [],
                key;

            for (key in obj) {
                ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }

            return ret.join('&');
        },

        get_video_id_from_location: function () {
            return location.search
                .slice(1)
                .split('&')
                .filter(function (a) {
                    a = a.split('=');
                    return a[0] === 'v';
                })[0]
                .split('=')[1];
        },

        get_offset: function (el) {
            var rect = el.getBoundingClientRect();

            return {
                top: rect.top + document.body.scrollTop,
                left: rect.left + document.body.scrollLeft
            };
        },

        light_switch_text: function () {
            return settings.lights ? this.locale('dark_mode') : this.locale('light_mode');
        },

        analytics_text: function () {
            return settings.realtime_analytics ? this.locale('realtime_analytics') : this.locale(
                'analytics');
        },

        comments_text: function () {
            return settings.spam_comments ? 'Likely spam comments' : this.locale('all_comments');
        }
    };

})();
