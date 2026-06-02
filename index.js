require('dotenv').config();
const express = require('express');
const database = require('./config/database');
const app = express();
const port = process.env.PORT;
const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const systemConfig = require('./config/system');

app.use(express.static('public'));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

database.connection();

routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Backend đang chạy ở port ${port}`);
})
