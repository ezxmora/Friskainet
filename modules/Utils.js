// /**
//  * Compares two strings and return a percentage from 0 to 1
//  * @param {String} first - First string to compare
//  * @param {String} second - Second string to compare
//  * @return {Float} The percentage of comparison
//  */
// module.exports.compareTwoStrings = (first, second) => {
// 	first = first.replace(/\s+/g, '');
// 	second = second.replace(/\s+/g, '');

// 	if (!first.length && !second.length) return 1;
// 	if (!first.length || !second.length) return 0;
// 	if (first === second) return 1;
// 	if (first.length === 1 && second.length === 1) return 0;
// 	if (first.length < 2 || second.length < 2) return 0;

// 	const firstBigrams = new Map();
// 	for (let i = 0; i < first.length - 1; i++) {
// 		const bigram = first.substring(i, i + 2);
// 		const count = firstBigrams.has(bigram)
// 			? firstBigrams.get(bigram) + 1
// 			: 1;

// 		firstBigrams.set(bigram, count);
// 	}

// 	let intersectionSize = 0;
// 	for (let i = 0; i < second.length - 1; i++) {
// 		const bigram = second.substring(i, i + 2);
// 		const count = firstBigrams.has(bigram)
// 			? firstBigrams.get(bigram)
// 			: 0;

// 		if (count > 0) {
// 			firstBigrams.set(bigram, count - 1);
// 			intersectionSize++;
// 		}
// 	}

// 	return (2.0 * intersectionSize) / (first.length + second.length - 2);
// };

// /**
//  * Checks if is a valid youtube URL
//  * @param {String} url - The Youtube url
//  * @returns {Boolean}
//  */
// module.exports.validYoutube = (url) => {
// 	return url.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm);
// };




module.exports = {
	/**
	 * Replaces multiple strings
	 * @param {String} string - The string to replace
	 * @param {Object} mapObject - The object with the patterns to replace
	 * @returns {String}
	 */
	replaceAll: (string, mapObject) => {
		const re = new RegExp(Object.keys(mapObject).join('|'), 'gi');

		return string.replace(re, function (matched) {
			return mapObject[matched.toLowerCase()];
		});
	},
	/**
	 * Generates and returns a random color
	 * @returns {Number}
	 */
	randomColor: () => {
		return ((1 << 24) * Math.random()) | 0;
	}

}