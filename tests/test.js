var test = require('tape')
var fs = require('fs')
var got = require('got')
var Transfer = require('../index')
var concat = require('concat-stream')
var PassThrough = require('stream').PassThrough()

var filePath = './package.json'
var testFile = fs.readFileSync(filePath)

test('File transfer', function (t) {
  t.plan(3)
  new Transfer(filePath).upload().then(function (url) {
    console.log('Uploaded done, url:', url)
    t.equal(typeof url, 'string', 'Returned url is a string')
    t.ok(url.match(/https:\/\/transfer.sh\/\S{3,}/), 'Url matches transfer.sh')
    got.get(url).then(function (res) {
      t.equal(res.body, testFile.toString(), 'Uploaded file matches the local one')
    })
  }).catch(console.error)
})

test('Encrypted file transfer', function (t) {
  t.plan(4)
  new Transfer(filePath, {password: 's3cr3t'}).upload().then(function (url) {
    console.log('Uploaded done, url:', url)
    t.equal(typeof url, 'string', 'Returned url is a string')
    t.ok(url.match(/https:\/\/transfer.sh\/\S{3,}/), 'Url matches transfer.sh')
    got.get(url).then(function (res) {
      t.notEqual(res.body, testFile.toString(), 'Uploaded file do not matches unencrypted local one')
      new Transfer(PassThrough, {password: 's3cr3t'}).decrypt(concat(function (decrypted) {
        t.equal(decrypted.toString(), testFile.toString(), 'File decrypted successfully')
      })).catch(console.error)
      PassThrough.end(Buffer.from(res.body))
    })
  }).catch(console.error)
})
