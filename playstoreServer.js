const express = require('express');
const morgan = require('morgan');
const storeData = require('./playstore-data.js');

const app = express();

app.use(morgan('dev'));



app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;

  const validSort = ['Rating', 'App'];
  
  if(sort && !validSort.includes(sort)) {
    return res.status(400).send('Please sort by either rating or app');
  }

  let sortedData = [];
  if(sort) {
    sortedData = storeData.sort((a, b) => {
      if(a[sort] < b[sort]) {
        return -1;
      } else if(a[sort] > b[sort]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  res.json(sortedData);
});

app.listen(8000, () => console.log('Listening on port 8000'));