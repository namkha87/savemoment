(function (root) {

	/**
		Curl.js

		@author	Raven Lagrimas | any.TV
	*/

	var stringify = function (obj) {
		    var ret = [],
		        key;
		    for (key in obj) {
		        ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
		    }
		    return ret.join('&');
		},

		Request = function (method) {
			this.method		= method;
			this.secure 	= false;
			this.started 	= false;
			this._raw 		= false;
			this.headers 	= {};

			this.to = function (url) {
				this.url = url;
				return this;
			};

			this.secured = function () {
				this.secure = true;
				return this;
			};

			this.add_header = function (key, value) {
				this.headers[key] = value;
				return this;
			};

			this.raw = function () {
				this._raw = true;
				return this;
			};

			this.args = function () {
				this._args = arguments;
				return this;
			};

			this.then = function (cb) {
				if (!this.cb) {
					this.cb = cb;
				}
				return this;
			};

			this.send = function (data) {
				var req = new XMLHttpRequest(),
					self = this,
					payload,
					i;

				this.started = true;

				if (data && this.method === 'GET') {
					this.url += '?' + stringify(data);
				}
				else {
					payload = stringify(data);
					this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				}

				if (!this._raw) {
					this.headers['Accept'] = 'application/json';
				}

				console.log(this.method, this.url);

				req.open(this.method, this.url, true);

				for (i in this.headers) {
					req.setRequestHeader(i, this.headers[i]);
				}

				req.send(payload);

				req.onreadystatechange = function () {
					var temp,
						s;

					if (req.readyState !== 4) {
						console.log(req);
						return;
					}

					s = req.responseText;

					if (self._raw) {
						if (req.status === 200) {
							return self.cb(null, s, self.headers, self._args);
						}

						temp = {
							message : s,
							statusCode : req.status
						};

						return self.cb(temp, s, self.headers, self._args);
					}

					try {
						JSON.parse(s);
					}
					catch (e) {
						e.statusCode = req.status;
						return self.cb(e, s, self.headers, self._args);
					}

					if (req.status === 200 || req.status === 304) {
						return self.cb(null, JSON.parse(s), self.headers, self._args);
					}

					self.cb({statusCode : req.status}, s, self.headers, self._args);
				};

				req.onerror = function (err) {
					self.cb(err);
				};

				return this;
			};
		};

	root.curl = {
		get : {
			to : function (url) {
				return new Request('GET').to(url);
			}
		},
		post : {
			to : function (url) {
				return new Request('POST').to(url);
			}
		},
		put : {
			to : function (url) {
				return new Request('PUT').to(url);
			}
		},
		delete : {
			to : function (url) {
				return new Request('DELETE').to(url);
			}
		},
		request : function (method) {
			this.to = function (url) {
				return new Request(method).to(url);
			};
			return this;
		},
		stringify : stringify
	};

})(this);
