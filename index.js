require('dotenv').config();
const express = require('express');
const database = require('./config/database');
const app = express();
const port = process.env.PORT;
const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

app.use(express.static('public'));

database.connection();

routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Backend đang chạy ở port ${port}`);
})
