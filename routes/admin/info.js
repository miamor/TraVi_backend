module.exports = function(db) {
    var module = {};

    module.getSiteInfo = function(req, res) {
        db.collection('site_info', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items[0]);
            });
        });
    };

    module.add = function(req, res) {
        var site_info = req.body;

        var dt = dateTime.create();
        site_info.created_time = site_info.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding site_info: ' + JSON.stringify(site_info));

        db.collection('site_info', function(err, collection) {
            collection.insert(site_info, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + site_infoON.stringify(result));
                    console.log(result.ops);
                    res.send(result.ops[0]);
                }
            });
        });
    }

    module.update = function(req, res) {
        var site_info = req.body;
        //delete site_info['_id'];

        var dt = dateTime.create();
        site_info.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating site_info: ');
        console.log(JSON.stringify(site_info));

        db.collection('site_info', function(err, collection) {
            collection.update({}, site_info, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating site_info: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send(site_info);
                }
            });
        });
    }

    return module;
}
