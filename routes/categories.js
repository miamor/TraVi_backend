module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving cat: ' + id);
        db.collection('categories', function(err, collection) {
            collection.findOne({'_id':ObjectID(id)}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findByLink = function(req, res) {
        var link = req.params.link;
        console.log('Retrieving cat: ' + link);
        db.collection('categories', function(err, collection) {
            collection.findOne({link:link}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAll = function(req, res) {
        db.collection('categories', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    return module;
}
