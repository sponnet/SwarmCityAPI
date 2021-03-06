'use strict';
const winston = require('winston');

module.exports = function(prefix) {
	const logger = winston.createLogger({
		format: winston.format.combine(
			winston.format.splat(), {
				transform: function(info, opts) {
					if (!info) return;
					info.message =
						info.message.reduce(function(res, cur) {
							if (typeof cur === 'object') {
								let append;
								if (cur instanceof Error) {
									append = JSON.stringify(cur, Object.getOwnPropertyNames(cur));
								} else {
									append = JSON.stringify(cur);
								}
								return res + ' ' + append;
							}
							return res + ' ' + cur;
						}, '');
					return info;
				},
			},
			winston.format.timestamp(),
			winston.format.printf((info) => {
				return `${info.timestamp} ${info.level}: ${prefix} - ${info.message}`;
			})
		),
		transports: [new winston.transports.Console({
			level: process.env.LOG_LEVEL || 'info',
		})],
	});

	return {
		info: function(...args) {
			logger.info.apply(logger, [args, {}]);
		},
		error: function(...args) {
			logger.error.apply(logger, [args, {}]);
		},
		warn: function(...args) {
			logger.warn.apply(logger, [args, {}]);
		},
		debug: function(...args) {
			logger.debug.apply(logger, [args, {}]);
		},
	};
};
