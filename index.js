const express = require('express');
const app = express();
const port = 3001;
const route = require('./routes/client/index.route');

route(app);

app.listen(port, () => {
  console.log(`Backend đang chạy ở port ${port}`);
})