#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(1))
var ncp = require('copy-paste')
var transfer = require('../index')

transfer(argv._[1])
  .then(gotUrl)
  .catch(catchError)

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
