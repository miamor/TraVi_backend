const port = 3003;
const SECRET_KEY = 'asimplekey';
const DB_HOST = 'localhost';

express = require('express'), jwt = require('jsonwebtoken'), expressJWT = require('express-jwt'), ObjectID = require("bson-objectid"), dateTime = require('node-datetime');
var cors = require('cors');
var mongo = require('mongodb');
var bodyParser = require('body-parser');

app = express();
app.set('superSecret', SECRET_KEY);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* Config server & token */
JWT_CONFIG = expressJWT({
    secret: app.get('superSecret'), // Use the same token that we used to sign the JWT above
    // Let's allow our clients to provide the token in a variety of ways
    getToken: function(req) {
        if (req.headers.authorization) { // Authorization: g1jipjgi1ifjioj
            var token = req.headers.authorization;


            var token = req.headers['Authorization'] || req.headers['authorization'];

            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                    if (err) {
                        return res.send({ success: false, message: 'Failed to authenticate token.' });
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                    }
                });
            }

            return req.headers.authorization;
        } else {
            //res.sendStatus(401);
        }
        // If we return null, we couldn't find a token.
        // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
        return null;
    }
}).unless({
    path: [
        /^(?!(\/(admin|user|company|sale)).*$).*/
    ]
});

// authorization check (role-based check)
function checkRole(roles) {
    return function(req, res, next) {
        //console.log(req.headers);
        if (roles.indexOf(req.user.type) > -1) {
            next();
        } else {
            return res.status(403).send({
                success: false,
                message: 'Insufficient permissions'
            });
        }
    }
}


app.use(JWT_CONFIG);

// setup permission middleware
app.use("/admin/users", checkRole(["admin"]));
//app.use(/\/admin\/(?!login)/, checkRole(["admin", "smod", "mod"]));
app.use(/\/user/, checkRole(["user"]));
app.use(/\/company/, checkRole(["company"]));
app.use(/\/sale/, checkRole(["sale"]));


// handling errors
app.use(function(err, req, res, next) {
    //console.log(req.headers);
    if (err.status === 403 || err.code === 'permission_denied') {
        return res.status(403).send({
            success: false,
            message: 'Insufficient permissions'
        });
    } else if (err.status === 401) {
        return res.status(401).send({
            success: false,
            message: err.message
        });
    } else if (err.status === 404) {
        return res.status(404).send({
            success: false,
            message: 'No method.'
        });
    }
});


/* Config server to connect to database */
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    server = new Server(DB_HOST, 27017, { auto_reconnect: true }),
    db = new Db('TraVi', server, { safe: true });

// Open DB to see if we need to populate with data
db.open(function(err, db) {
    if (!err) {
        console.log("Connected to database");

        app.disable('etag');

        var LOGIN = require('./routes/login'),
            login = new LOGIN(db);
        app.post('/login', login.login);
        app.post('/login/sale', login.loginSale);


        /* Admin routes */
        var ADMIN_USERS = require('./routes/admin/users'),
            admin_users = new ADMIN_USERS(db);
        app.get('/admin/users', admin_users.findAll);
        app.get('/admin/users/:id', admin_users.findById);
        app.post('/admin/users', admin_users.add);
        app.put('/admin/users/:id', admin_users.update);
        app.delete('/admin/users/:id', admin_users.delete);



        /* Company routes */
        var COMP_TOURS = require('./routes/company/tours'),
            comp_tours = new COMP_TOURS(db);
        app.get('/company/tours', comp_tours.findAll);
        app.get('/company/tours/view/:id', comp_tours.findById);
        app.post('/company/tours', comp_tours.add);
        app.put('/company/tours/:id', comp_tours.update);
        app.delete('/company/tours/:id', comp_tours.delete);



        /* Sales routes */
        var SALE_TOURS = require('./routes/sale/tours'),
            sale_tours = new SALE_TOURS(db);
        app.get('/sale/tours', sale_tours.findAll);
        app.get('/sale/tours/view/:id', sale_tours.findById);
        app.post('/sale/tours', sale_tours.add);
        app.put('/sale/tours/:id', sale_tours.update);
        app.delete('/sale/tours/:id', sale_tours.delete);
        app.post('/sale/tours/refresh', sale_tours.refresh);

        var SALE_MSG = require('./routes/sale/msg'),
            sale_msg = new SALE_MSG(db);
        app.get('/sale/messages_list', sale_msg.getList);



        /* User routes */
        var USER_ME_INFO = require('./routes/user/me'),
            user_me_info = new USER_ME_INFO(db);
        app.get('/user/me', user_me_info.getMyInfo);
        app.put('/user/me/update', user_me_info.update);

        var USER_TRIPS = require('./routes/user/trips'),
            user_trips = new USER_TRIPS(db);
        app.get('/user/trips', user_trips.findAll);
        app.get('/user/trips/view/:id', user_trips.findById);

        var USER_MSG = require('./routes/user/msg'),
            user_msg = new USER_MSG(db);
        app.get('/user/messages_list', user_msg.getList);


        /* Everyone routes */
        var TOURS = require('./routes/tours'),
            tours = new TOURS(db);
        app.get('/tours', tours.findAll);
        app.get('/tours/type', tours.getType);
        app.get('/tours/object', tours.getObject);
        app.get('/tours/company/:company_id', tours.findAllByCompany);
        app.get('/tours/view/:id', tours.findById);
        app.post('/tours/inquire', tours.inquire);

        var TRIPS = require('./routes/trips'),
            trips = new TRIPS(db);
        app.get('/trips', trips.findAll);
        app.get('/trips/user/:username', trips.findAllByUsername);
        app.get('/trips/view/:id', trips.findById);
        app.get('/trips/view/:id/photos', trips.getPhotos);

        /*var CHAT = require('./routes/chat'),
            chat = new CHAT(db);
        app.get('/chat', chat.start);*/

        // Fire up the server
        app.listen(port);
        console.log('Listening on port ' + port + '...');
    }
});