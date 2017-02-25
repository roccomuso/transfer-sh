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

### Example

```javascript
const transfer = require('transfer-sh')

transfer(__dirname+'/hello.txt')
  .then(function (link) { console.log(link) })
  .catch(function (err) { console.log(err) })
```

## Author

#### Rocco Musolino
