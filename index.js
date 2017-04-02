var fs = require('fs')
var path = require('path')
var got = require('got')
var concat = require('concat-stream')
var pump = require('pump')

var domain = 'https://transfer.sh'
var options = {}

module.exports = function (fileInput) {
  return new Promise(function (resolve, reject) {
    var fileStream = fs.createReadStream(fileInput)
    pump(fileStream,
         got.stream.put(domain + '/' + path.basename(fileInput), options),
         concat(function (link) { resolve(link.toString()) }),
         reject)
  })
}
