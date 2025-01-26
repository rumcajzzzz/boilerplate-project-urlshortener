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

app.get('/api/shorturl', function(req, res) {
  const url = {
    originalURL: req.body.url,
    parsedURL: express.json(url),
    shortid: null
  };
  const shorturl = [];
  if(url.originalURL && (url.originalURL("https://") || url.originalURL.startsWith("http://"))) { 
    if(!Object.values(urlDatabase).includes(url.originalURL)) {
      url.shortid = id;
      urlDatabase[url.shortid] = url.originalURL;
      id++;
      res.json({
        original_url: url.originalURL,
        short_url: url.shortid
      });
    } else {
      const shortid = Object.keys(urlDatabase).find(key => urlDatabasep[key] === originalURL);
      res.json({
        original_url: url.originalURL,
        short_url: url.shortid
      })
    }
  } else {
    res.json({ error: "invalid url"});
  }
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalURL = urlDatabase[shortUrl];

  if (originalURL) { 
    res.redirect(originalURL);
  } else {
    res.json({error: "No short URL found for the given input"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
