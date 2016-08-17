/*
	A simple caching mechanism based on the browser's Local Storage. If Local
	Storage isn't supported, the cache will gracefully fail.

	Author: James Colannino <crankycyclops@gmail.com>
*/
var LocalStorageCache = {

	// Clears the specified key
	clear: function (key) {

		// silently fail if local storage isn't supported by the browser
		if ('undefined' === typeof(Storage)) {
			return;
		}

		localStorage.removeItem(key);
	},

	/************************************************************************/

	// Returns data indexed by the specified key
	get: function (key) {

		// silently fail if local storage isn't supported by the browser
		if ('undefined' === typeof(Storage)) {
			return null;
		}

		var item = $.parseJSON(localStorage[key]);

		if (!item) {
			return null;
		}

		// if expire time is set to 0, the item never expires
		if (0 != item.expireTime && Math.floor(Date.now() / 1000) - item.timeSet >= item.expireTime) {
			localStorage.removeItem(key);
			return null;
		}

		return item.data;
	},

	/************************************************************************/

	// Caches the specified data with the specified key for the specified
	// expiry time. If no expiry time is set, a default of 0 is used,
	// meaning that the item never expires.
	set: function (key, value, expireTime) {

		// silently fail if local storage isn't supported by the browser
		if ('undefined' === typeof(Storage)) {
			return;
		}

		if ('undefined' === typeof(expireTime)) {
			expireTime = 0;
		}

		try {
			localStorage.setItem(key, JSON.stringify({
				data: value,
				timeSet: Math.floor(Date.now() / 1000),
				expireTime: expireTime
			}));
		}

		// For whatever reason, caching failed. No biggy. Just silently fail.
		catch (error) {
			return;
		}
	}
};
