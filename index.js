require('dotenv').config();
// const request = require('request');
const app = require('./config/custom-express');

/*
setInterval(function () {
    request('https://api-pratopratico.herokuapp.com/', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });
}, 1500000); //sends a GET request every 25 minutes (1500000) to maintain the app awake
*/

app.listen(process.env.PORT || 5000);
