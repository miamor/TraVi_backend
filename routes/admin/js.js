module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving cat: ' + id);
        db.collection('js', function(err, collection) {
            collection.findOne({'_id':ObjectID(id)}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findByFilename = function(req, res) {
        var filename = req.params.filename;
        console.log('Retrieving cat: ' + filename);
        db.collection('js', function(err, collection) {
            collection.findOne({filename:filename}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAll = function(req, res) {
        db.collection('js', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.add = function(req, res) {
        var js = req.body;

        var dt = dateTime.create();
        js.created_time = js.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding js: ' + JSON.stringify(js));

        db.collection('js', function(err, collection) {
            collection.insert(js, {safe:true}, function(err, result) {
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
        var filename = req.params.filename;
        var js = req.body;
        //delete js['_id'];
        js.filename = filename;

        var dt = dateTime.create();
        js.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating js: ' + filename);
        console.log(JSON.stringify(js));

        db.collection('js', function(err, collection) {
            collection.update({filename: filename}, js, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating js: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send(js);
                }
            });
        });
    }

    module.delete = function(req, res) {
        var filename = req.params.filename;
        console.log('Deleting js: ' + filename);
        db.collection('js', function(err, collection) {
            collection.remove({filename: filename}, {safe:true}, function(err, result) {
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
