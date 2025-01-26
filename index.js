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

  const url = {
    originalURL: req.body.url,
    shortid: null
  };

  console.log("Received URL: ", url.originalURL); 

  if(url.originalURL && (url.originalURL.startsWith("https://") || url.originalURL.startsWith("http://"))) { 
    for (const shortid in urlDatabase) {
      if (urlDatabase[shortid] === url.originalURL) {
        return res.json ({
          original_url: url.originalURL,
          short_url: shortid
        })
      }
    }

    const shortid = id;
    url.shortid = shortid;
    urlDatabase[shortid] = url.originalURL;
    id++;

    res.json({
      original_url: url.originalURL,
      short_url: url.shortid
    })

  } else {
    res.json({ error: "Invalid URL."});
  }
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
