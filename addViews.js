const dalNoSQL = require('./DAL/no-sql.js');

var designDoc = {
    _id: '_design/food',
    views: {
        'food': {
            map: function(doc) {
                if (doc.type === 'food') {
                    emit(doc.name + doc._id);
                }
            }.toString()
        }
    }
}

var designDoc2 = {
    _id: '_design/beverage',
    views: {
        'beverage': {
            map: function(doc) {
                if (doc.type === 'beverage') {
                    emit(doc.name + doc._id);
                }
            }.toString()
        }
    }
}

var designDoc3 = {
    _id: '_design/ingredients',
    views: {
        'ingredients': {
            map: function(doc) {
                if (doc.type === 'ingredients') {
                    emit(doc.ingredients + doc._id);
                }
            }.toString()
        }
    }
}

dalNoSQL.createView(designDoc, function callback(err, data) {
    if (err) return console.log(err);
    if (data) {
        console.log(data);
    }
})

dalNoSQL.createView(designDoc2, function callback(err, data) {
    if (err) return console.log(err);
    if (data) {
        console.log(data);
    }
})
