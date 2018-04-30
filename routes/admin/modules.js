module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving module: ' + id);
        db.collection('modules', function(err, collection) {
            collection.findOne({'_id':ObjectID(id)}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

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
            var data = collection.find({}, {_id: 1, link:1, parent:1, text:1, show:1, show_nav:1, type:1}).sort({updated_time: -1}).toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.findAllFull = function(req, res) {
        db.collection('modules', function(err, collection) {
            /*collection.find().sort({create_time: -1}).toArray(function(err, items) {
                var Ar = {};
                for (i = 0; i < items.length; i++) {
                    if (!items[i].parent) items[i].parent = '';
                    if (!items[i].content) items[i].content = '';
                }
                Ar.data = items;
                res.send(items);
            });*/
            var data = collection.find().sort({updated_time: -1}).toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.add = function(req, res) {
        var modules = req.body;

        var dt = dateTime.create();
        modules.created_time = modules.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding module: ' + JSON.stringify(modules));

        db.collection('modules', function(err, collection) {
            collection.insert(modules, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result));
                    console.log(result.ops);
                    res.send(result.ops[0]);
                }
            });
        });
    }

    module.update = function(req, res) {
        var link = req.params.link;
        var modules = req.body;
        //delete modules['_id'];

        // don't change link
        modules.link = link;

        var dt = dateTime.create();
        modules.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating modules: ' + link);
        console.log(JSON.stringify(modules));

        db.collection('modules', function(err, collection) {
            data = collection.findOne({'link':link}, function(err, item) {
                modules.fix = item.fix;
                
                collection.update({link: link}, modules, {safe:true}, function(err, result) {
                    if (err) {
                        console.log('Error updating modules: ' + err);
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('' + result + ' document(s) updated');
                        res.send(modules);
                    }
                });
            });
        });
    }

    module.delete = function(req, res) {
        var link = req.params.link;
        console.log('Deleting modules: ' + link);
        db.collection('modules', function(err, collection) {
            collection.remove({link: link, fix:{$ne: 'true'} }, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    console.log('' + result + ' document(s) deleted');
                    res.send(req.body);
                }
            });
        });
    }

    return module;
}
