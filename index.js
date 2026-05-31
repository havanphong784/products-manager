require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const route = require('./routes/client/index.route');

app.use(express.static('public'));

route(app);

app.listen(port, () => {
  console.log(`Backend đang chạy ở port ${port}`);
})
