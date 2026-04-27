const express = require('express');
var cors = require('cors')
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors())

const routes = require('./src/routes')

app.use((req, res, next) => {
//   console.log(
//     `${new Date().toISOString()} - ${req.method} request to ${req.url}`
//   );
  next();
});
 
app.use('/api',routes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
