require('dotenv').config();
const express = require('express');
const database = require('./config/database');
const app = express();
const port = process.env.PORT || 3000;
const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const systemConfig = require('./config/system');
const methodOverrides = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverrides('_method'));

// app.use(express.static('public'));
app.use(express.static(`${__dirname}/public`));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(cookieParser('hocbackendnodejs'));
app.use(session({cookie: {maxAge: 60000}}));
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin;

database.connection();

routeAdmin(app);
route(app);
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Backend đang chạy ở port ${port}`);
    });
}

module.exports = app;
