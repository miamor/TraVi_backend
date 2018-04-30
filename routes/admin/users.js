module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving user: ' + id);
        db.collection('users', function(err, collection) {
            collection.findOne({_id:ObjectID(id)}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAll = function(req, res) {
        db.collection('users', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.add = function(req, res) {
        var users = req.body;

        var dt = dateTime.create();
        users.created_time = users.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding user: ' + JSON.stringify(users));

        db.collection('users', function(err, collection) {
            collection.insert(users, {safe:true}, function(err, result) {
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
        var users = req.body;
        //delete users['_id'];

        db.collection('users', function(err, collection) {
            collection.findOne({_id:ObjectID(id)}, function(err, oldUserData) {

                //var oldUserData = module.findById(req, res);
                //console.log(oldUserData);
                users['username'] = oldUserData['username']; // keep old username
                users['password'] = oldUserData['password']; // keep old password

                var dt = dateTime.create();
                users.updated_time = dt.format('Y-m-d H:M:S');
                console.log('Updating users: ' + id);
                console.log(JSON.stringify(users));

                //db.collection('users', function(err, collection) {
                    collection.update({_id:ObjectID(id)}, users, {safe:true}, function(err, result) {
                        if (err) {
                            console.log('Error updating users: ' + err);
                            res.send({'error':'An error has occurred'});
                        } else {
                            console.log('' + result + ' document(s) updated');
                            res.send(users);
                        }
                    });
                //});
            })
        });
    }

    module.delete = function(req, res) {
        var id = req.params.id;
        console.log('Deleting users: ' + id);
        db.collection('users', function(err, collection) {
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
