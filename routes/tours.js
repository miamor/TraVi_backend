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

    module.inquire = function(req, res) {
        var postParams = req.body;

        var tourInfo = postParams.tourInfo;
        delete postParams['tourInfo'];

        postParams.type = 'tour_inquire';
        postParams.tourID = ObjectID(tourInfo._id);
        postParams.title = tourInfo.title;
        postParams.thumb = tourInfo.thumb;

        //postParams.destination = tourInfo.destination;
        postParams.destination = [];
        for (var i = 0; i < tourInfo.destination_by_city.length; i++) {
            var v = tourInfo.destination_by_city[i];
            var dst_days = parseInt(v.days);
            var dst_dateFrom = new Date(postParams.dateFrom);
            if (i > 0) {
                dst_dateFrom = new Date(postParams.destination[i-1].dateTo);
            }
            var dst_dateTo = new Date();
            dst_dateTo.setTime( dst_dateFrom.getTime() + dst_days * 86400000 );
            var dst_dateFrom_str = dst_dateFrom.toISOString().split('T')[0];
            var dst_dateTo_str = dst_dateTo.toISOString().split('T')[0];

            console.log("Date to["+i+"]: "+dst_dateTo);
            console.log(dst_dateTo_str);
            postParams.destination.push({title: v.title, dateFrom: dst_dateFrom_str, dateTo: dst_dateTo_str});
        }
        
        duration_days = parseInt(tourInfo.duration.split(' ')[0]);

        var dateFrom = new Date(postParams.dateFrom);
        
        //var dateTo = new Date();
        //dateTo.setTime( dateFrom.getTime() + duration_days * 86400000 );

        postParams.dateFrom = postParams.dateFrom.split('T')[0];
        //postParams.dateTo = dateTo.toISOString().split('T')[0];
        postParams.dateTo = postParams.destination[postParams.destination.length-1].dateTo;

        postParams.paid = 0;
        var dt = dateTime.create();
        postParams.created_time = postParams.updated_time = dt.format('Y-m-d H:M:S');

        console.log('Sending inquirement tour: '+JSON.stringify(postParams));
        db.collection('trips', function(err, collection) {
            collection.insertOne(postParams, { safe: true }, function (err, result) {
                if (err) {
                    res.send({ status: 'error', message: 'An error has occurred' });
                } else {
                    console.log('Success: ' + JSON.stringify(result));
                    result.ops[0].id = result.ops[0]._id;
                    console.log(result.ops[0]);
                    res.send({ status: 'success', data: result.ops[0] });
                }
            });
        });

    }

    module.getType = function(req, res) {
        db.collection('tour_type', function(err, collection) {
            collection.find().toArray(function(err, items) {
                themes = [];
                for (i = 0; i < items.length; i++) {
                    //items[i].id = items[i]._id;
                    themes.push(items[i].name);
                }
                res.send(themes);
            });
        });
    }

    module.getObject = function(req, res) {
        db.collection('tour_object', function(err, collection) {
            collection.find().toArray(function(err, items) {
                objs = {};
                for (i = 0; i < items.length; i++) {
                    //items[i].id = items[i]._id;
                    objs[items[i].code] = items[i].name;
                }
                res.send(objs);
            });
        });
    }

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

    module.findAllByCompany = function(req, res) {
        var page = Number(req.query.page);
        var lim = Number(req.query.limit);
        var skipNum = (page - 1) * lim;

        var company_id = req.params.company_id.split(',');
        console.log('Retrieving tours of company: ' + company_id);
        db.collection('tours', function(err, collection) {
            collection.find({ company_id: { $in: company_id } }).limit(lim).skip(skipNum).toArray(function(err, items) {
                for (i = 0; i < items.length; i++) {
                    items[i].id = items[i]._id;
                }
                res.send(items);
            });
        });
    };

    return module;
}