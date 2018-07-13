var fs = require('fs')
var got = require('got')
var Transfer = require('../index')
var test = require('tape')

test('File transfer', function (t) {
  t.plan(3)
  let testFile = fs.readFileSync('./package.json')
  new Transfer('./package.json').upload().then(function (url) {
    console.log('Uploaded done, url:', url)
    t.equal(typeof url, 'string', 'Returned url is a string')
    t.ok(url.match(/https:\/\/transfer.sh\/\S{3,}/), 'Url matches transfer.sh')
    got.get(url).then(function (res) {
      t.equal(res.body, testFile.toString(), 'Uploaded file matches the local one')
    })
  }).catch(console.error)
})
