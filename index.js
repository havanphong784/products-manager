require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const route = require('./routes/client/index.route');

route(app);

app.listen(port, () => {
  console.log(`Backend đang chạy ở port ${port}`);
})