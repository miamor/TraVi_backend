module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving post: ' + id);
        db.collection('posts', function(err, collection) {
            collection.findOne({_id:ObjectID(id)}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAll = function(req, res) {
        console.log(req.user);
        db.collection('posts', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.add = function(req, res) {
        var posts = req.body;

        var dt = dateTime.create();
        posts.created_time = posts.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding post: ' + JSON.stringify(posts));

        db.collection('posts', function(err, collection) {
            collection.insert(posts, {safe:true}, function(err, result) {
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
        var posts = req.body;
        //delete posts['_id'];

        var dt = dateTime.create();
        posts.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating posts: ' + id);
        console.log(JSON.stringify(posts));

        db.collection('posts', function(err, collection) {
            collection.update({_id:ObjectID(id)}, posts, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating posts: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send(posts);
                }
            });
        });
    }

    module.delete = function(req, res) {
        var id = req.params.id;
        console.log('Deleting posts: ' + id);
        db.collection('posts', function(err, collection) {
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
