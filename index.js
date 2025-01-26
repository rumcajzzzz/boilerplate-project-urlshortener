require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' })); // Zapewniamy dostęp z różnych źródeł
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let id = 1;
const urlDatabase = {};

app.post('/api/shorturl', function(req, res) {
  console.log("Received body: ", req.body);

  let originalURL = req.body.url;

  // Jeśli URL nie zaczyna się od http:// lub https://, dodajemy https://
  if (!/^https?:\/\//i.test(originalURL)) {
    originalURL = 'https://' + originalURL;
  }

  // Poprawiony wzorzec URL
  const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;

  if (!originalURL || !urlPattern.test(originalURL)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  // Sprawdzamy, czy URL już istnieje w bazie danych
  for (const shortid in urlDatabase) {
    if (urlDatabase[shortid] === originalURL) {
      return res.json({
        original_url: originalURL,
        short_url: shortid // Odpowiedź z krótkim URL
      });
    }
  }

  // Tworzymy nowy krótki URL
  const shortid = id++;
  urlDatabase[shortid] = originalURL;

  const response = {
    original_url: originalURL,
    short_url: shortid
  };

  console.log("Response sent: ", response);
  res.json(response); // Zwracamy odpowiedź JSON
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalURL = urlDatabase[shortUrl];

  if (originalURL) {
    // Przekierowujemy do oryginalnego URL
    res.redirect(originalURL);
  } else {
    // Obsługujemy przypadek, gdy krótkiego URL nie znaleziono
    res.status(404).json({ error: "No short URL found for the given input." });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
