/*jshint esversion: 6 */
const path = require('path');
const PouchDB = require('pouchdb-http');
PouchDB.plugin(require('pouchdb-mapreduce'));
const fetchConfig = require('zero-config');
var R = require('ramda');

var config = fetchConfig(path.join(__dirname, '..'), {dcValue: 'test'});
const urlFormat = require('url').format;
const db = new PouchDB(urlFormat(config.get("couch")));

var dal = {
    getBeverage: getBeverage,
    updateBeverage: updateBeverage,
    createBeverage: createBeverage,
    deleteBeverage: deleteBeverage,
    listBeverage: listBeverage,
    createView: createView,
    getByIngredient: getByIngredient,
    getBySubType: getBySubType,
    getFood: getFood,
    updateFood: updateFood,
    createFood: createFood,
    deleteFood: deleteFood,
    listFood: listFood
};

//  ---------  UTILITY  ----------  //
function queryDB(sortBy, startKey, limit, callback) {
    if (typeof startKey == "undefined" || startKey === null) {
        return callback(new Error('Missing startKey parameter'));
    } else if (typeof limit == "undefined" || limit === null || limit === 0) {
        return callback(new Error('Missing limit parameter'));
    } else {
        limit = startKey === ''
            ? Number(limit)
            : Number(limit) + 1;
        console.log("sortBy: ", sortBy, " startKey: ", startKey, " limit: ", limit)
        db.query(sortBy, {
            startkey: startKey,
            limit: limit,
            include_docs: true
        }).then(function(result) {
            if (startKey !== '' && result.rows.length > 0) {
                result.rows.shift();
            }
            return callback(null, result.rows);
        }).catch(function(err) {
            return callback(err);
        });
    }
}

function getDocByID(id, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof id == "undefined" || id === null) {
        return callback(new Error('400Missing id parameter'));
    } else {
        db.get(id, function(err, data) {
            if (err)
                return callback(err);
            if (data)
                return callback(null, data);
            }
        );
    }
}

function updateDoc(data, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for update'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400Missing id property from data'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400Missing rev property from data'));
    } else {
        db.put(data, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }
}

function deleteDoc(data, callback) {
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for delete'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400Missing _id property from data'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400Missing _rev property from data'));
    } else {
        db.remove(data, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }
}

function createView(designDoc, callback) {
    if (typeof designDoc == "undefined" || designDoc === null) {
        return callback(new Error('400Missing design document.'));
    } else {
        db.put(designDoc, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }
}

function getByIngredient(ingredient, callback) {
    db.allDocs({
        include_docs: true,
        attachments: true
    }, function(err, response) {
        if (err) {
            return callback(err);
        }
        var results = []
        R.map(function(item) {
            if (R.prop('ingredients', item.doc)) {
              R.map(function(ing) {
                  if (ing === ingredient) {
                      results.push(item.doc)
                  }
              }, R.prop('ingredients', item.doc) )
            }
        }, response.rows)
        callback(null, results)
    })
}
function getBySubType(subType, callback) {
    db.allDocs({
        include_docs: true,
        attachments: true
    }, function(err, response) {
        if (err) {
            return callback(err);
        }
        var results = []
        R.map(function(item) {
            if (R.prop('subtype', item.doc)) {
                if (item.doc.subtype === subType) {
                    results.push(item.doc)
                }
            }
        }, R.prop('rows', response) )
        callback(null, results)
    })
}


//  -----------  BEVERAGES  ------------  //
function getBeverage(id, callback) {
    getDocByID(id, callback)
}

function listBeverage(sortBy, startKey, limit, callback) {
    queryDB(sortBy, startKey, limit, callback)
}

function createBeverage(data, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for create'));
    } else if (data.hasOwnProperty('_id') === true) {
        return callback(new Error('400Unnecessary id property within data.'));
    } else if (data.hasOwnProperty('_rev') === true) {
        return callback(new Error('400Unnecessary rev property within data'));
    } else if (data.hasOwnProperty('name') !== true) {
        return callback(new Error('400Missing name property within data'));
    } else if (data.hasOwnProperty('subtype') !== true) {
        return callback(new Error('400Missing subtype property within data'));
    } else if (data.hasOwnProperty('ingredients') !== true) {
        return callback(new Error('400Missing ingredients property within data'));
    } else {
        data.active = true;
        data.type = 'beverage';
        data._id = 'beverage_' + data.name;

        db.put(data, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }
}

function updateBeverage(data, callback) {
    updateDoc(data, callback)
}

function deleteBeverage(data, callback) {
    deleteDoc(data, callback)
}

//  -----------  FOOD  --------------  ///
function getFood(id, callback) {
    getDocByID(id, callback)
}

function listFood(sortBy, startKey, limit, callback) {
    queryDB(sortBy, startKey, limit, callback)
}

function createFood(data, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for create'));
    } else if (data.hasOwnProperty('_id') === true) {
        return callback(new Error('400Unnecessary id property within data.'));
    } else if (data.hasOwnProperty('_rev') === true) {
        return callback(new Error('400Unnecessary rev property within data'));
    } else if (data.hasOwnProperty('name') !== true) {
        return callback(new Error('400Missing name property within data'));
    } else if (data.hasOwnProperty('subtype') !== true) {
        return callback(new Error('400Missing subtype property within data'));
    } else if (data.hasOwnProperty('ingredients') !== true) {
        return callback(new Error('400Missing ingredients property within data'));
    } else {
        data.active = true;
        data.type = 'food';
        data._id = 'food_' + data.name;

        db.put(data, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }
}

function updateFood(data, callback) {
    updateDoc(data, callback)
}

function deleteFood(data, callback) {
    deleteDoc(data, callback)
}

module.exports = dal
