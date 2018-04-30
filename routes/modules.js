module.exports = function(db) {
    var module = {};

    /*module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving module: ' + id);
        db.collection('modules', function(err, collection) {
            collection.findOne({'_id':ObjectID(id)}, function(err, item) {
                res.header({
                    'ETag': null,
                    'Access-Control-Expose-Headers': 'X-Total-Count',
                    'X-Total-Count': 1,
                    // Disable caching for content files
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                });
                console.log(item);
                res.send(item);
            })
        });
    };*/

    module.findByLink = function(req, res) {
        var link = req.params.link;
        console.log('Retrieving module: ' + link);
        db.collection('modules', function(err, collection) {
            collection.findOne({'link':link}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAll = function(req, res) {
        db.collection('modules', function(err, collection) {
            collection.find({show:"true", show_nav:"true"}, {_id: 1, link:1, parent:1, text:1}).toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.loadMultiple = function (req, res) {
        var m = req.params.m.split(',');
        console.log('Retrieving these: ' + m);

        var data = {};
        db.collection('modules', function(err, collection) {
            collection.find({ link : { $in: m } }).toArray(function(err, items) {
                for (i = 0; i < items.length; i++) {
                    if (!items[i].parent) items[i].parent = '';
                    if (!items[i].content) items[i].content = '';
                    data[items[i].link] = items[i];
                }
                res.send(data);
            });
        });
    }

    module.findAllFull = function(req, res) {
        db.collection('modules', function(err, collection) {
            collection.find().toArray(function(err, items) {
                for (i = 0; i < items.length; i++) {
                    if (!items[i].parent) items[i].parent = '';
                    if (!items[i].content) items[i].content = '';
                }
                res.send(items);
            });
        });
    };

    return module;
}
