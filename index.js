var http = require("http")
    , ReadStream = require("read-stream")
    , httpDuplex = require("http-duplex")
    , reemit = require("re-emitter").reemit

    , serverEvents = [
        "request"
        , "connection"
        , "close"
        , "checkContinue"
        , "connect"
        , "upgrade"
        , "clientError"
        , "listening"
        , "error"
    ]

    , serverMethods = [
        "listen"
        , "close"
        , "address"
    ]

    , serverProperties = [
        "maxHeadersCount"
        , "maxConnections"
        , "connections"
    ]

module.exports = HttpStream

function HttpStream() {
    var queue = ReadStream()
        , server = http.createServer(handler)
        , stream = queue.stream

    server.on("close", queue.end)

    serverMethods.forEach(addMethod)

    reemit(server, stream, serverEvents)

    serverProperties.forEach(function addProperty(propName) {
        Object.defineProperty(stream, propName, {
            set: set
            , get: get
            , configurable: true
            , enumerable: true
        })

        function set(value) {
            server[propName] = value
        }

        function get() {
            return server[propName]
        }
    })

    return stream

    function handler(req, res) {
        var dup = httpDuplex(req, res)

        queue.push(dup)
    }

    function addMethod(methodName) {
        stream[methodName] = method

        function method() {
            server[methodName].apply(server, arguments)
            return stream
        }
    }
}
