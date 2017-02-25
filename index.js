var got = require('got')
var fs = require('fs')
var concat = require('concat-stream')
var ncp = require('copy-paste')
var pump = require('pump')

var domain = 'transfer.sh'
var options = {}
var fileInput = process.argv[2]
var fileStream = fs.createReadStream(fileInput)

pump(fileStream,
     got.stream.put(domain + '/' + fileInput, options),
     concat(gotUrl),
     catchError)

function gotUrl (url) {
  console.log(' ' + url.toString())
  ncp.copy(url.toString(), function (err) {
    catchError(err)
    console.log(' \u2713 Copied to clipboard\n')
    process.exit(0) // HACK see: node-copy-paste/issues/32
  })
}

function catchError (err) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
}
