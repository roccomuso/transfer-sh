var fs = require('fs')
var crypto = require('crypto')
var through2 = require('through2')
var base64 = require('base64-stream')

var algorithm = 'aes-256-cbc'
var password = 'ciao'

var encrypt = crypto.createCipher(algorithm, password)


var r = fs.createReadStream('prova.txt')

r.pipe(encrypt)
 .pipe(base64.encode())
 .pipe(through2(function(chunk, enc, next){
   console.log(chunk)
   this.push(chunk)
   next()
  }))
 .pipe(fs.createWriteStream('out.enc'))

