require('dotenv').config();
const express = require('express');
const cors = require('cors');
const url = require('url');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let id = 1;
const urlDatabase = {};

app.post('/api/shorturl', function (req, res) {
  console.log("Received body: ", req.body);

  let originalURL = req.body.url;
  if (!originalURL) {
    console.log("Error: Missing 'url' in the request body");
    return res.json({ error: 'invalid url' });
  }

  let parsedUrl = url.parse(originalURL);

  if (!parsedUrl.protocol) {
    originalURL = 'https://' + originalURL;
    parsedUrl = url.parse(originalURL);
  }

  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    console.log("Error: Invalid URL format:", originalURL);
    return res.json({ error: 'invalid url' });
  }

  for (const shortid in urlDatabase) {
    if (urlDatabase[shortid] === originalURL) {
      return res.json({
        original_url: originalURL,
        short_url: shortid
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

app.get('/api/shorturl/:short_url', function (req, res) {
  const shortUrl = req.params.short_url;
  const originalURL = urlDatabase[shortUrl];

  if (originalURL) {
    res.redirect(originalURL);
  } else {
    res.json({ error: "No short URL found for the given input." });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
