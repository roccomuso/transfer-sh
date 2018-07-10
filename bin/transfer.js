#!/usr/bin/env node
var clipboardy = require('clipboardy')
var Transfer = require('../index')

var argv = require('minimist')(process.argv.slice(1), {
  alias: {
    'version': 'v'
  }
})

if (argv.v) {
  console.log('v' + require('../package.json').version)
  process.exit(0)
}

if (argv.d) { /* Decrypt */
  if (!argv.p) catchError('No password provided')
  var output = argv.o || 'output.md'
  new Transfer(argv.d, {password: argv.p})
  .decrypt(output)
  .then(function () {
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
  clipboardy.write(url).then(function () {
    console.log(' \u2713 Link copied to clipboard\n')
  }).catch(catchError)
}

function catchError (err) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
}
