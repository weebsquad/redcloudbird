const {verify} = require('jsonwebtoken');

async function jwtVerify(token, cert) {
	return new Promise(async (resolve) => {
    verify(token, cert, (err, decoded) => {
      if (err) {
        return resolve(false)
      }

      resolve(decoded)
    })
  })
}

module.exports = jwtVerify;
