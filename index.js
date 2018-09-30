/**
 * Welcome API main file
 * 
 */

// Requir
var http = require('http')
var config = require('./config')
var stringDecoder = require('string_decoder').StringDecoder
var URL = require('url')


// Create HTTP Server
var httpServer = http.createServer(function (req, res) {
  let url = URL.parse(req.url, true)
  var decoder = new stringDecoder('utf-8')
  var buffer = ''

  req.on('data', function (data) {
    buffer += decoder.write(data)
    console.log('Data: ', data)
  })

  req.on('end', function () {
    buffer += decoder.end()
    let data = {
      'path'        : url.pathname.replace(/\/+|\/+$/g, ''),
      'method'      : req.method.toLowerCase(),
      'queryString' : url.query,
      'headers'     : req.headers,
      'payload'     : buffer
    }

    let handler = typeof(router[data.path]) !== 'undefined' ? router[data.path] : router.notFound
    handler(data, function(statusCode, payload = buffer) {
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200

      payload = typeof(payload) === 'object' ? payload : {}

      let payloadString = JSON.stringify(payload)

      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
      console.log('Request: ', data)
      console.log("Responce: ", statusCode, payloadString)

    })
  })

})

// Start HTTP server
httpServer.listen(config.httpPort, function () {
  console.log(`Server listen on port ${config.httpPort}`)
})

// Routers
var handlers = {}

handlers.hello = function (data, callback) {

  let payload = {}
  payload.welcomeString = typeof(data) !== 'undefined' && typeof(data.queryString.name) !== 'undefined' ? `Good to see you, ${data.queryString.name}!` : 'Hi there!'
  if (typeof(data) === 'undefined' || typeof(data.queryString.name) === 'undefined') {
    payload.description = 'Please, introduce your self using query string like ?name=YOUR_NAME'
  }
  callback(200,payload)
}

handlers.sample = function (data, callabck) {
  callabck(200,{'goTo':'/hello'})
}

handlers.notFound = function (data, callback) {
  callback(404,{'goTo':['/sample', '/hello']})
}

var router = {
  'sample'  : handlers.sample,
  'hello'   : handlers.hello
}