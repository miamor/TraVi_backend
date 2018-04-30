module.exports = function(db) {
    var module = {};

    module.loginSale = function(req, res) {
        var users = req.body;

        console.log('Login as user: ' + JSON.stringify(users));

        db.collection('users', function(err, collection) {
            collection.findOne( { username: users.username, password: users.password, type: 'sale' }, function(err, user) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log('Success: ' + JSON.stringify(user));

                    if (!user) {
                        res.json({ status: 'error', message: 'Authentication failed. User not found.' });
                    } else if (user) {
                        const payload = {
                            id: user._id,
                            username: user.username,
                            //password: user.password,
                            type: user.type
                        };
                        var token = jwt.sign(payload, app.get('superSecret'));

                        response = {
                            status: 'success',
                            message: 'Enjoy your token!',
                            uType: user.type,
                            token: token,
                            user_info: user
                        };
                        res.send(response);
                    }
                }
            });
        });
    }

    module.login = function(req, res) {
        var users = req.body;

        console.log('Login as: ' + JSON.stringify(users));

        db.collection('users', function(err, collection) {
            collection.findOne( { username: users.username, password: users.password }, function(err, user) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log('Success: ' + JSON.stringify(user));
                    //console.log(result.ops);
                    //res.send(result.ops[0]);
                    //var token = crypto.randomBytes(64).toString('hex');
                    //response = {token: };

                    if (!user) {
                        res.json({ status: 'error', message: 'Authentication failed. User not found.' });
                    } else if (user) {
                        const payload = {
                            id: user._id,
                            username: user.username,
                            //password: user.password,
                            type: user.type
                        };
                        /*var token = jwt.sign(payload, app.get('superSecret'), {
                            expiresInMinutes: 1440 // expires in 24 hours
                        });*/
                        var token = jwt.sign(payload, app.get('superSecret'));

                        // return the information including token as JSON
                        /*res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });*/
                        response = {
                            status: 'success',
                            message: 'Enjoy your token!',
                            uType: user.type,
                            token: token,
                            user_info: user
                        };
                        res.send(response);
                    }
                }
            });
        });
    }

    return module;
}