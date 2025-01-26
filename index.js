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
  console.log("Received body: ", req.body);  // Logowanie ciała żądania

  const originalURL = req.body.url;

  const urlPattern = /^(https?:\/\/)([a-z0-9-]+\.)+[a-z0-9]{2,}([\/\?].*)?$/i;

  if (!originalURL || !urlPattern.test(originalURL)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  // Check if URL already exists in the database
  for (const shortid in urlDatabase) {
    if (urlDatabase[shortid] === originalURL) {
      return res.json({
        original_url: originalURL,
        short_url: shortid // No need to convert to Number
      });
    }
  }

  // Create a new short URL
  const shortid = id++;
  urlDatabase[shortid] = originalURL;

  const response = {
    original_url: originalURL,
    short_url: shortid
  };

  console.log("Response sent: ", response);  // Logowanie odpowiedzi
  res.json(response);
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalURL = urlDatabase[shortUrl];

  if (originalURL) {
    // Redirect to the original URL
    res.redirect(originalURL);
  } else {
    // Handle case when short URL is not found
    res.status(404).json({ error: "No short URL found for the given input." });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
