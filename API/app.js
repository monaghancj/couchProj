// Our API goes here!
var HTTPError = require('node-http-error')
var bodyParser = require('body-parser')
var express = require('express')
var app = express()
const port = process.env.PORT || 3000  // Use process.env to acess the contents of the user environment
const dal = require('../DAL/no-sql.js')

app.use(bodyParser.json())

// ------  GENERAL  -------  //
app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(err)
})

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
