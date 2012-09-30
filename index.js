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
    ]

    , serverMethods = [
        "listen"
        , "close"
    ]

module.exports = HttpStream

function HttpStream() {
    var queue = ReadStream()
        , server = http.createServer(handler)
        , stream = queue.stream

    server.on("close", queue.end)

    serverMethods.forEach(function (methodName) {
        stream[methodName] = method

        function method() {
            server[methodName].apply(server, arguments)
            return stream
        }
    })

    reemit(server, stream, serverEvents)

    return stream

    function handler(req, res) {
        var dup = httpDuplex(req, res)

        queue.push(dup)
    }
}
