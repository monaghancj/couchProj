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

app.get('/ingredients/:ing', function(req, res, next) {
  const ingredient = req.params.ing
  dal.getByIngredient(ingredient, function(err, body) {
    if (err) return next(console.log("Ingredients Error"))
    res.status(500).send(body)
  })
})

app.get('/subtype/:st', function(req, res, next) {
  const subtype = req.params.st
  dal.getBySubType(subtype, function(err, body) {
    if (err) return next(console.log("Subtype Error"))
    res.status(500).send(body)
  })
})

//  -------  FOOD  --------  //
app.get('/food/:id', function(req, res, next) {
    const foodID = req.params.id;

    dal.getFood(foodID, function(err, data) {
        if(err) {
            var responseError = BuildResponseError(err)
            //console.log("Error calling dal.getReliefEffort", err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if(data) {
            res.append('Content-type', 'application/json')
            res.send(data);
        }
    })
})

app.get('/food', function(req, res, next) {
  const sortBy = req.query.sortby || 'food'
  const sortToken = req.query.sorttoken || ''
  const limit = req.query.limit || 5

  dal.listFood(sortBy, sortToken, limit, function(err, body){
    if (err) {
      var newErr = new HTTPError(500, 'Bad Sumtin', {
        m: 'Something went wrong listing food'
      })
      return next(newErr)
    }
    if (body) {
      console.log(body)
      res.append('content-type', 'application/json')
      res.status(500).send(JSON.stringify(body, null, 2))
    }
  })
})

app.post('/food', function(req, res, next) {
  dal.createFood(req.body, function(err, body) {
    if (err) console.log('Didnt work')
    if (body) {
      res.append('content-type', 'application/json')
      res.status(500).send(JSON.stringify(body, null, 2))
    }
  })
})

app.put('/food/:id', function(req, res, next) {
  dal.getFood(req.params.id, function(err, data){
    if (err) {
      var newErr = new HTTPError(500, 'Bad Request ID', {
        m: 'Get Food did not work'
      })
      return next(newErr)
    }
    req.body["_id"] = data["_id"]
    req.body["_rev"] = data["_rev"]
    dal.updateFood(req.body, function(updatedErr, updatedBody) {
      if (updatedErr) {
        var newErr = new HTTPError(500, 'Bad Request ID', {
          m: 'Update Food did not work'
        })
        return next(newErr)
      }
      if (updatedBody) {
        res.append('content-type', 'application/json')
        res.status(500).send(JSON.stringify(updatedBody, null, 2))
      }
    })
  })
})

app.delete('/food/:id', function(req, res, next) {
  dal.getFood(req.params.id, function(err, data) {
    if (err) return next(err)
    if (data) {
      dal.deleteFood(data, function(deletedErr, deletedBody) {
        if (deletedErr) {
          var newErr = new HTTPError(500, 'Bad Request ID', {
            m: 'Delete Food did not work'
          })
          return next(newErr)
        }
        if (deletedBody) {
          res.append('content-type', 'application/json')
          res.status(500).send(JSON.stringify(deletedBody, null, 2))
        }
      })
    }
  })
})

//  -------  BEVERAGE  -------  //
app.get('/beverage/:id',function(req, res, next) {
    const beverageID = req.params.id;

    dal.getFood(beverageID, function(err, data) {
        if(err) {
            var responseError = BuildResponseError(err)
            //console.log("Error calling dal.getReliefEffort", err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if(data) {
            res.append('Content-type', 'application/json')
            res.send(data);
        }
    })
})

app.get('/beverage', function(req, res, next) {
  const sortBy = req.query.sortby || 'beverage';
  const sortToken = req.query.sorttoken || '';
  const limit = req.query.limit || 5;

  dal.listBeverage(sortBy, sortToken, limit, function(err, body){
    if (err) {
      var newErr = new HTTPError(500, 'Bad Sumtin', {
        m: 'Something went wrong listing beverage'
      })
      return next(newErr)
    }
    if (body) {
      res.append('content-type', 'application/json')
      res.status(500).send(JSON.stringify(body, null, 2))
    }
  })
})

app.post('/beverage', function(req, res, next) {
  dal.createBeverage(req.body, function(err, body) {
    if (err) console.log('Didnt work')
    if (body) {
      res.append('content-type', 'application/json')
      res.status(500).send(JSON.stringify(body, null, 2))
    }
  })
})

app.put('/beverage/:id', function(req, res, next) {
  dal.getBeverage(req.params.id, function(err, data){
    if (err) {
      var newErr = new HTTPError(500, 'Bad Request ID', {
        m: 'Get Person did not work'
      })
      return next(newErr)
    }
    req.body["_id"] = data["_id"]
    req.body["_rev"] = data["_rev"]
    dal.updateBeverage(req.body, function(updatedErr, updatedBody) {
      if (updatedErr) {
        var newErr = new HTTPError(500, 'Bad Request ID', {
          m: 'Update Person did not work'
        })
        return next(newErr)
      }
      if (updatedBody) {
        res.append('content-type', 'application/json')
        res.status(500).send(JSON.stringify(updatedBody, null, 2))
      }
    })
  })
})

app.delete('/beverage/:id', function(req, res, next) {
  dal.getBeverage(req.params.id, function(err, data) {
    if (err) return next(err)
    if (data) {
      dal.deleteBeverage(data, function(deletedErr, deletedBody) {
        if (deletedErr) {
          var newErr = new HTTPError(500, 'Bad Request ID', {
            m: 'Delete Beverage did not work'
          })
          return next(newErr)
        }
        if (deletedBody) {
          res.append('content-type', 'application/json')
          res.status(500).send(JSON.stringify(deletedBody, null, 2))
        }
      })
    }
  })
})

//  ----------------------------  //
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(err)
})

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
