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

  // Assigning the URL from the body of the request
  const originalURL = req.body.url;
  console.log("Received URL: ", originalURL);

  // Check if the URL starts with 'http://' or 'https://'
  if (originalURL && (originalURL.startsWith("https://") || originalURL.startsWith("http://"))) {

    // Check if the URL already exists in the database
    for (const shortid in urlDatabase) {
      if (urlDatabase[shortid] === originalURL) {
        return res.json({
          original_url: originalURL,
          short_url: shortid
        });
      }
    }

    // If the URL is not found in the database, assign a new shortid
    const shortid = id;
    urlDatabase[shortid] = originalURL;
    id++;  // Increment the shortid for next time

    // Return the JSON response with original URL and short URL
    return res.json({
      original_url: originalURL,
      short_url: shortid
    });

  } else {
    // If the URL is invalid, return an error message
    return res.json({ error: "Invalid URL." });
  }
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalURL = urlDatabase[shortUrl];

  if (originalURL) {
    // Redirect to the original URL if found
    res.redirect(originalURL);
  } else {
    // If no corresponding original URL is found, return an error message
    res.json({ error: "No short URL found for the given input." });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
