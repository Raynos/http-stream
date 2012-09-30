# http-stream

Turn a HTTP server into a stream

## Example

``` js
var chain = require("chain-stream")
    , pattern = require("mapleTree").pattern
    , HttpStream = require("..")

var server = chain(HttpStream().listen(8080))

server
    .filter(route("/"))
    .filter(method("GET"))
    .forEach(function (dup) {
        dup.end("hello world")
    })

server
    .filter(route("/json"))
    .filter(method("GET"))
    .forEach(function (dup) {
        dup.setHeader("content-type", "application/json")
        dup.end(JSON.stringify({ hello: "world" }))
    })

function route(uri) {
    var match = pattern(uri)

    return filter

    function filter(dup) {
        return match(dup.url)
    }
}

function method(methodName) {
    return filter

    function filter(dup) {
        return dup.method === methodName
    }
}

```

## Installation

`npm install http-stream`

## Contributors

 - Raynos

## MIT Licenced
