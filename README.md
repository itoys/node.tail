# node.js tail implementation

## Install

```
npm install yes-tail
```

## Usage

>new Tail(target, options);

```javascript
var Tail = require('yes-tail');
var tailFile = new Tail('fileName.log',{follow: true, lines: 20});
tailFile.on('line', console.log);
tailFile.on('error', console.error);
```

## Options
Optional. Default values:

```javascript
{
   buffer: 63 * 1024 - 1, //max value
   sep: '\n',             //Line separator
   lines: 10,             //how much lines show from end (tail -n 10)
   follow: false,         //(tail -F)
   sleep: 500             //how often the target should be polled in ms(tail -s 0.5)
}
```

## Events

### line

* *line*    String next line from the target

### error

* *error*   Error object