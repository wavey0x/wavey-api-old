const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries');
const https = require('https');
const fs = require('fs');
const app = express()

let port = 3001

app.use(bodyParser.json());
const cors = require('cors');
app.use(cors({
    origin: '*'
}));;
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

let options = {}
if(process.env.ENV == "PROD"){
    let key = fs.readFileSync('/etc/letsencrypt/live/wavey.info/privkey.pem');
    let cert = fs.readFileSync('/etc/letsencrypt/live/wavey.info/fullchain.pem');
    options = {
        key: key,
        cert: cert
    };
    // port = 80;
}

const server = https.createServer(options, app);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/addresses', db.getAddresses)

server.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

