const fetch = require('node-fetch')

async function getIps () {
  const req = await fetch('https://api.cloudflare.com/client/v4/ips')
  const res = await req.json()
  const ipv4 = res.result.ipv4_cidrs
  const ipv6 = res.result.ipv6_cidrs
  console.log(`Got CF IPs - ${ipv4.length} IPv4 - ${ipv6.length} IPv6`)
  return [...ipv4, ...ipv6]
}
module.exports = getIps
