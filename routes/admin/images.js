module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving image: ' + id);
        db.collection('gallery_images', function(err, collection) {
            collection.findOne({_id:ObjectID(id)}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAllInModule = function(req, res) {
        var moduleLink = req.params.module;
        db.collection('gallery_images', function(err, collection) {
            collection.find({module:moduleLink}).toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.findAll = function(req, res) {
        db.collection('gallery_images', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.add = function(req, res) {
        var images = req.body;

        var dt = dateTime.create();
        images.created_time = images.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding image: ' + JSON.stringify(images));

        db.collection('gallery_images', function(err, collection) {
            collection.insert(images, {safe:true}, function(err, result) {
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
        var id = req.params.id;
        var images = req.body;
        //delete images['_id'];

        var dt = dateTime.create();
        images.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating images: ' + id);
        console.log(JSON.stringify(images));

        db.collection('gallery_images', function(err, collection) {
            collection.update({_id:ObjectID(id)}, images, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating images: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send(images);
                }
            });
        });
    }

    module.delete = function(req, res) {
        var id = req.params.id;
        console.log('Deleting images: ' + id);
        db.collection('gallery_images', function(err, collection) {
            collection.remove({_id:ObjectID(id)}, {safe:true}, function(err, result) {
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
