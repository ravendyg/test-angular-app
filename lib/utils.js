'use strict';

function getUnixTimestamp()
{
	return Math.round( Date.now() / 1000 );
}
module.exports.getUnixTimestamp = getUnixTimestamp;