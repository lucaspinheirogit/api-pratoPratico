const app = require('./config/custom-express');
require('dotenv').config();

app.listen(process.env.PORT || 5000);