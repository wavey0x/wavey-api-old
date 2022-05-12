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
}

const server = https.createServer(options, app);

app.get('/', (req, res) => {
    res.json({ info: 'Welcome to wavey API' })
})

app.get('/position-monitor', (req, res) => {
  fs.readFile('./position_monitor.json', (err, json) => {
  let obj = JSON.parse(json);
      res.json(obj);
  });
})

// app.get('/addresses', db.getAddresses)

if(process.env.ENV == "PROD"){
  server.listen(port, () => {
      console.log(`App running on port ${port}.`)
  })
}
else{
  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
}
