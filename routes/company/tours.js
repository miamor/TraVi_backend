module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving tour: ' + id);
        db.collection('tours', function(err, collection) {
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
        db.collection('tours', function(err, collection) {
            collection.find().limit(lim).skip(skipNum).toArray(function(err, items) {
                for (i = 0; i < items.length; i++) {
                    items[i].id = items[i]._id;
                }
                res.send(items);
            });
        });
    };

    module.add = function(req, res) {
        var tours = req.body;

        var dt = dateTime.create();
        tours.created_time = tours.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding tour: ' + JSON.stringify(tours));

        for (var key in tours.packages_active) {
            if (tours.packages_active[key] == 0) {
              delete tours.package[key];
            }
          }
          delete tours['objectActive'];
          delete tours['suitableActive'];
          delete tours['packages_active'];
    
    
        db.collection('tours', function(err, collection) {
            collection.insert(tours, {safe:true}, function(err, result) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result));
                    console.log(result.ops);
                    res.send({status: 'success', data: result.ops[0]});
                }
            });
        });
    }

    module.update = function(req, res) {
        var id = req.params.id;
        var tours = req.body;
        //delete tours['_id'];

        var dt = dateTime.create();
        tours.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating tours: ' + id);
        console.log(JSON.stringify(tours));

        db.collection('tours', function(err, collection) {
            collection.update({_id:ObjectID(id)}, tours, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating tours: ' + err);
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send({status: 'success', data: tours});
                }
            });
        });
    }

    module.delete = function(req, res) {
        var id = req.params.id;
        console.log('Deleting tours: ' + id);
        db.collection('tours', function(err, collection) {
            collection.remove({_id:ObjectID(id)}, {safe:true}, function(err, result) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) deleted');
                    res.send({status: 'success', data: req.body});
                }
            });
        });
    }


    return module;
}
