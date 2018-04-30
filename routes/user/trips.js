module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving trip: ' + id);
        db.collection('trips', function(err, collection) {
            collection.findOne({ _id: ObjectID(id) }, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAll = function(req, res) {
        var page = Number(req.query.page);
        var lim = Number(req.query.limit);
        var skipNum = (page - 1) * lim;
        db.collection('trips', function(err, collection) {
            collection.find().limit(lim).skip(skipNum).toArray(function(err, items) {
                for (i = 0; i < items.length; i++) {
                    items[i].id = items[i]._id;
                }
                res.send(items);
            });
        });
    };

    module.findAllByUsername = function(req, res) {
        var page = Number(req.query.page);
        var lim = Number(req.query.limit);
        var skipNum = (page - 1) * lim;

        var username = req.params.username.split(',');
        console.log('Retrieving trips of username: ' + username);
        db.collection('trips', function(err, collection) {
            collection.find({ username: { $in: username } }).limit(lim).skip(skipNum).toArray(function(err, items) {
                for (i = 0; i < items.length; i++) {
                    items[i].id = items[i]._id;
                }
                res.send(items);
            });
        });
    };

    return module;
}