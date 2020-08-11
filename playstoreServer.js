const express = require('express');
const morgan = require('morgan');
const storeData = require('playstore-data.js');

const app = express();

app.use(morgan());