'use strict';

const web3 = require('../globalWeb3').web3;
const validate = require('../validators');

module.exports = function() {
	return ({
		/**
		 * Get Nonce
		 * @param {object} data - { address: <The user's pub key> }
		 * @return {Object} - address + nonce of that address
		 */
		getNonce: function(data) {
			return new Promise((resolve, reject) => {
				if (!data || !data.address) {
					return reject(new Error('No data/address supplied'));
				}
				if (!validate.isAddress(data.address)) {
					return reject(new Error('No valid address supplied'));
				}

				web3.eth.getTransactionCount(data.address).then((nonce) => {
					resolve({
						address: data.address,
						nonce: nonce,
					});
				}).catch(reject);
			});
		},
	});
};
