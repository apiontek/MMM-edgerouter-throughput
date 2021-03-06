/** 
 * EdgeRouter Throughput
 * A MagicMirror² Module to show the Interface throughput of an Ubiquity EdgeRouter
 * 
 * Version 1.0.0
 * By Michael Scharl <michael.scharl@me.com>
 * 
 * License MIT
 * 
 * This is an autogenerated file. DO NOT EDIT!
 */
(function () {
	'use strict';

	const BYTE_UNITS = [
		'B',
		'kB',
		'MB',
		'GB',
		'TB',
		'PB',
		'EB',
		'ZB',
		'YB'
	];

	const BIT_UNITS = [
		'b',
		'kbit',
		'Mbit',
		'Gbit',
		'Tbit',
		'Pbit',
		'Ebit',
		'Zbit',
		'Ybit'
	];

	/*
	Formats the given number using `Number#toLocaleString`.
	- If locale is a string, the value is expected to be a locale-key (for example: `de`).
	- If locale is true, the system default locale is used for translation.
	- If no value for locale is specified, the number is returned unmodified.
	*/
	const toLocaleString = (number, locale) => {
		let result = number;
		if (typeof locale === 'string') {
			result = number.toLocaleString(locale);
		} else if (locale === true) {
			result = number.toLocaleString();
		}

		return result;
	};

	var prettyBytes = (number, options) => {
		if (!Number.isFinite(number)) {
			throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
		}

		options = Object.assign({bits: false}, options);
		const UNITS = options.bits ? BIT_UNITS : BYTE_UNITS;

		if (options.signed && number === 0) {
			return ' 0 ' + UNITS[0];
		}

		const isNegative = number < 0;
		const prefix = isNegative ? '-' : (options.signed ? '+' : '');

		if (isNegative) {
			number = -number;
		}

		if (number < 1) {
			const numberString = toLocaleString(number, options.locale);
			return prefix + numberString + ' ' + UNITS[0];
		}

		const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1);
		// eslint-disable-next-line unicorn/prefer-exponentiation-operator
		number = Number((number / Math.pow(1000, exponent)).toPrecision(3));
		const numberString = toLocaleString(number, options.locale);

		const unit = UNITS[exponent];

		return prefix + numberString + ' ' + unit;
	};

	var ModuleNotification;
	(function (ModuleNotification) {
	    ModuleNotification["CONFIG"] = "CONFIG";
	    ModuleNotification["THROUGHPUT"] = "THROUGHPUT";
	})(ModuleNotification || (ModuleNotification = {}));

	var DOM_INSTANCES = {};
	Module.register('MMM-edgerouter-throughput', {
	    /**
	     * Define the default instance config
	     */
	    defaults: {
	        title: undefined,
	        showInterfaceName: true,
	    },
	    _throughputData: {},
	    _lastThroughputData: {},
	    start: function () {
	        this.sendSocketNotification(ModuleNotification.CONFIG, this.config);
	    },
	    /**
	     * Core-Function to return the modules DOM-Tree.
	     */
	    getDom: function () {
	        var _a = this._getDomInstance(), down = _a.down, interfaceName = _a.interfaceName, root = _a.root, title = _a.title, up = _a.up;
	        var config = this.config;
	        title.innerText = config.title;
	        interfaceName.innerText = config.interface;
	        if (this._lastThroughputData[config.gateway] &&
	            this._lastThroughputData[config.gateway][config.interface] &&
	            this._throughputData[config.gateway] &&
	            this._throughputData[config.gateway][config.interface]) {
	            var lastTxBytes = this._lastThroughputData[config.gateway][config.interface].tx_bytes;
	            var currentTxBytes = this._throughputData[config.gateway][config.interface].tx_bytes;
	            var lastRxBytes = this._lastThroughputData[config.gateway][config.interface].rx_bytes;
	            var currentRxBytes = this._throughputData[config.gateway][config.interface].rx_bytes;
	            var txRate = currentTxBytes - lastTxBytes;
	            var rxRate = currentRxBytes - lastRxBytes;
	            up.innerText = prettyBytes(txRate) + '/s';
	            down.innerText = prettyBytes(rxRate) + '/s';
	        }
	        return root;
	    },
	    socketNotificationReceived: function (notifiction, payload) {
	        switch (notifiction) {
	            case ModuleNotification.THROUGHPUT:
	                this._setThroughputData(payload);
	                break;
	        }
	    },
	    _getDomInstance: function () {
	        var identifier = this.identifier;
	        // Create DOM Elements only if not created before.
	        if (!DOM_INSTANCES[identifier]) {
	            var root = document.createElement('div');
	            var titleWrapper = document.createElement('div');
	            var title = document.createElement('span');
	            var interfaceName = document.createElement('span');
	            var throughput = document.createElement('div');
	            var upIcon = document.createElement('span');
	            var up = document.createElement('span');
	            var downIcon = document.createElement('span');
	            var down = document.createElement('span');
	            // Helper functions.
	            var space = function () { return document.createTextNode(' '); };
	            var br = function () { return document.createElement('br'); };
	            titleWrapper.classList.add('xsmall');
	            // Append title only when interface name is hidden and title is available.
	            if (this.config.title && !this.config.showInterfaceName) {
	                root.append(titleWrapper);
	                titleWrapper.append(title);
	                titleWrapper.classList.add('bold');
	            }
	            // Append interface Name when no title is given and interface should be shown.
	            else if (!this.config.title && this.config.showInterfaceName) {
	                root.append(titleWrapper);
	                titleWrapper.append(interfaceName);
	                titleWrapper.classList.add('bold');
	            }
	            // Append title and interface name when both should be shown
	            else if (this.config.title && this.config.showInterfaceName) {
	                root.append(titleWrapper);
	                titleWrapper.classList.add('normal');
	                interfaceName.classList.add('bold');
	                titleWrapper.append(title, space(), interfaceName);
	            }
	            root.append(throughput);
	            throughput.append(downIcon, space(), down, br(), upIcon, space(), up);
	            throughput.classList.add('bright');
	            throughput.classList.add('small');
	            throughput.classList.add('light');
	            upIcon.classList.add('normal');
	            upIcon.classList.add('bold');
	            upIcon.innerText = '↑';
	            downIcon.classList.add('normal');
	            downIcon.classList.add('bold');
	            downIcon.innerText = '↓';
	            DOM_INSTANCES[identifier] = {
	                interfaceName: interfaceName,
	                root: root,
	                title: title,
	                up: up,
	                down: down,
	            };
	        }
	        return DOM_INSTANCES[identifier];
	    },
	    _setThroughputData: function (data) {
	        this._lastThroughputData = this._throughputData;
	        this._throughputData = data;
	        this.updateDom();
	    },
	});

}());
