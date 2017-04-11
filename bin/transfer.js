#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(1))
var ncp = require('copy-paste')
var Transfer = require('../index')

console.log(argv)

if (argv.d){ /* Decrypt */
  if (!argv.p) catchError('No password provided')
  var output = argv.o || 'output.md'
  new Transfer(argv.d, {password: argv.p})
  .decrypt(output)
  .then(function(){
    console.log('Successfully decrypted in', output)
  })
  .catch(catchError)
} else { /* Possibly Encrypt and Upload */
  new Transfer(argv._[1], {password: argv.p})
  .upload()
  .then(gotUrl)
  .catch(catchError)
}

function gotUrl (url) {
  console.log(' ' + url)
  ncp.copy(url, function (err) {
    catchError(err)
    console.log(' \u2713 Link copied to clipboard\n')
    process.exit(0) // HACK see: node-copy-paste/issues/32
  })
}

function catchError (err) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
}
