const fetch = require('node-fetch');
const {cfAccessDomain} = require('./config');
async function getCerts() {
	const req = await fetch(`https://${cfAccessDomain}/cdn-cgi/access/certs`);
	const certs = await req.json();
	console.log('Got certs for ' + cfAccessDomain);
	return certs;
}
module.exports = getCerts;
