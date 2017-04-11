# transfer-sh [![NPM Version](https://img.shields.io/npm/v/transfer-sh.svg)](https://www.npmjs.com/package/transfer-sh)
Node.js CLI tool for easy file sharing using Transfer.sh

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


### Install

The easiest way to get **transfer-sh** is with npm:

    $ npm install -g transfer-sh

### CLI Usage

    $ transfer hello.txt

Will return a link to the resource and automatically you'll have it copied to your clipboard.

PS. <code>transfer</code> is an alias for <code>transfer-sh</code>.

Encrypt a file using a password:

    $ transfer hello.txt -p s3cr3t

### Example

```javascript
var Transfer = require('transfer-sh')

/* Encrypt and Upload */
var t = new Transfer('./Hello.md', {password: 's3cr3t'})
t.upload()
 .then(function (link) { console.log(link) })
 .catch(function (err) { console.log(err) })

/* Decrypt */
 var t2 = new Transfer('./Hello.enc', {password: 's3cr3t'})
 t2.decrypt('Output.md')
  .then(function (wStream) { console.log('Decrypted!') }) // it returns a writableStream
  .catch(function (err) { console.log(err) })

```

### Options

`password`: optional field, if provided will encrypt the file with `aes-256-cbc` no-salt and base64 encoded before the upload.

You can then easily decrypt your file using `transfer-sh` itself:

    $ transfer -d hello.enc -p s3cr3t [-o output.txt]

or the `openssl` util:

    $ openssl aes-256-cbc -d -a -nosalt -in <encrypted_file> -out <destination> -k <password>

openssl param explanation:

`-d` decrypt.
`-a` to decode base64 (with line break). NB. The file is base64 encoded to be easy human-readable and to allow easy copy-paste.
`-nosalt` The used node crypto lib by default doesn't apply any salt.
`-in` input encrypted file.
`-out` output decrypted file.
`-k` password.

## Author

#### Rocco Musolino

## LICENSE

MIT
