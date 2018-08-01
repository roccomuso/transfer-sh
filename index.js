var fs = require('fs')
var os = require('os')
var path = require('path')
var got = require('got')
var concat = require('concat-stream')
var pump = require('pump')
var crypto = require('crypto')
var through2 = require('through2')
var base64 = require('base64-stream')
var block = require('batched-stream')
var eos = require('end-of-stream')
var PassThroughStream = require('stream').PassThrough

var domain = 'https://transfer.sh'

function Transfer (fileInput, opts) {
  if (!fileInput) throw Error('File input required')
  var algorithm = 'aes-256-cbc'
  this.fileInput = fileInput
  this.opts = opts || {}
  this.httpOptions = {}
  this.inputStream = fs.createReadStream(fileInput)
  this.encryptedStream = null
  this.sEncrypt = this.opts.password ? crypto.createCipher(algorithm, this.opts.password) : new PassThroughStream()
  this.sDecrypt = this.opts.password ? crypto.createDecipher(algorithm, this.opts.password) : new PassThroughStream()
}

Transfer.prototype.upload = function () {
  var self = this
  if (this.opts.password) this._crypt()
  return new Promise(function (resolve, reject) {
    pump(self.encryptedStream || self.inputStream,
      got.stream.put(domain + '/' + path.basename(self.fileInput), self.httpOptions),
      concat(function (link) { resolve(link.toString()) }),
      reject)
  })
}

Transfer.prototype._crypt = function () {
  this.encryptedStream = this.inputStream.pipe(this.sEncrypt)
    .pipe(base64.encode())
    .pipe(new block({size: 76, strictMode: false}))
    .pipe(through2(function (chunk, enc, next) {
      this.push(chunk + os.EOL) // new line every 76 chars
      next()
    }))
}

Transfer.prototype.decrypt = function (destination) {
  if (!destination) throw Error('destination required for the decrypt method')
  var self = this
  return new Promise(function (resolve, reject) {
    var wStream = fs.createWriteStream(destination)
    eos(wStream, function (err) {
      if (err) return reject(new Error('stream had an error or closed early'))
      resolve(this)
    })
    /* start decrypt */
    self.inputStream.pipe(base64.decode())
      .pipe(self.sDecrypt)
      .pipe(wStream)
  })
}

module.exports = Transfer
