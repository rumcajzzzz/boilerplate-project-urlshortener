require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


let id = 1;
const urlDatabase = {};

app.post('/api/shorturl', function(req, res) {
  console.log("Received body: ", req.body);

  const originalURL = req.body.url;

  const urlPattern = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;

  if (!originalURL || !urlPattern.test(originalURL)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  for (const shortid in urlDatabase) {
    if (urlDatabase[shortid] === originalURL) {
      return res.json({
        original_url: originalURL,
        short_url: Number(shortid)
      });
    }
  }

  const shortid = id++;
  urlDatabase[shortid] = originalURL;

  const response = {
    original_url: originalURL,
    short_url: shortid 
  };

  console.log("Response sent: ", response);
  res.json(response);
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalURL = urlDatabase[shortUrl];

  if (originalURL) { 
    res.redirect(originalURL);
  } else {
    res.json({error: "No short URL found for the given input."});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
