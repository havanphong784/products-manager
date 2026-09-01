require('dotenv').config();
const express = require('express');
const database = require('./config/database');
const app = express();
const port = process.env.PORT || 3000;
const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const systemConfig = require('./config/system');
const http = require('http');
const {Server} = require("socket.io");
const methodOverrides = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path');
const moment = require('moment');

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverrides('_method'));

// app.use(express.static('public'));
app.use(express.static(`${__dirname}/public`));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1800000}  // 30 phút
}));
app.use(flash());

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
database.connection();

// Socket.io
const server = http.createServer(app);
const io = new Server(server);
const socketRoute = require('./sockets/client/index');
socketRoute(io);

routeAdmin(app);
route(app);

app.use((req, res) => {
  res.status(404).render('client/pages/errors/404', {
    pageTitle: '404 Not Found'
  });
});
if (process.env.NODE_ENV !== 'production') {
  server.listen(port, () => {
    console.log(`Backend đang chạy ở port ${port}`);
  });
}

module.exports = app;
