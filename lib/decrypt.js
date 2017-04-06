var crypto = require('crypto')
var fs = require('fs')

var algorithm = 'aes-256-cbc'
var password = 'ciao'

var r = fs.createReadStream('./out.enc')

// decrypt content
var decrypt = crypto.createDecipher(algorithm, password)

r.pipe(decrypt).pipe(fs.createWriteStream('out.txt'))
