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

    module.add = function(req, res) {
        var categories = req.body;

        var dt = dateTime.create();
        categories.created_time = categories.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding cat: ' + JSON.stringify(categories));

        db.collection('categories', function(err, collection) {
            collection.insert(categories, {safe:true}, function(err, result) {
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
        var categories = req.body;
        //delete categories['_id'];
        // don't change link
        categories.link = link;

        var dt = dateTime.create();
        categories.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating categories: ' + link);
        console.log(JSON.stringify(categories));

        db.collection('categories', function(err, collection) {
            collection.update({link: link}, categories, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating categories: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send(categories);
                }
            });
        });
    }

    module.delete = function(req, res) {
        var link = req.params.link;
        console.log('Deleting categories: ' + link);
        db.collection('categories', function(err, collection) {
            collection.remove({link: link}, {safe:true}, function(err, result) {
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
