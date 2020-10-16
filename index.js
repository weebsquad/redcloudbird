const redbird = require('redbird');
// const { getClientIp } = require('request-ip');
const morgan = require('morgan');
const { mappings, cfAccessDomain } = require('./config');
const cookie = require('cookie');
const asyncVerify = require('./asyncVerify');
const getCerts = require('./getCerts');
const getIps = require('./getCfIps');
const ipRangeCheck = require('ip-range-check');


async function run() {
	let accessCerts = await getCerts();
	let ips = await getIps();
	var authResolver = async function (host, url, req) {
		// const IP = getClientIp(req);
		// console.log('IP = ' + IP);
		const srvip = req.connection.remoteAddress;
		if(!ipRangeCheck(srvip, ips)) {
			console.log('SRVIP = ' + srvip);
			return;
		}
		
		const cookieHeader = req.headers['cookie']
		const cookieToken  = cookieHeader ? cookie.parse(cookieHeader)['CF_Authorization'] : null
		const headerToken  = req.headers['cf-access-jwt-assertion'];
		const token        = headerToken || cookieToken;
		if (!token) {
			return
		}
		const jwtChecks   = await Promise.all(accessCerts.public_certs.map(publicCert => asyncVerify(token, publicCert.cert)))
		const passedCheck = jwtChecks.find(jwtPayload => jwtPayload && jwtPayload.iss === `https://${cfAccessDomain}`)

		if (passedCheck) {
			return mappings[host];
		}
	}
	authResolver.priority = 200;
	let proxy = redbird({port: process.env.LISTEN_PORT, xfwd: true, resolvers: [authResolver]});
	console.log(`Web server listening on port ${process.env.LISTEN_PORT}`);
	setInterval(async () => {
		const newCerts = await getCerts();
		accessCerts = newCerts;
		const newIps = await getIps();
		ips = newIps;
	}, 1000 * 60 * 60)
}

run();
