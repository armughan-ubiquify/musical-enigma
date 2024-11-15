const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/urlshortener', { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
});
const Url = mongoose.model('Url', urlSchema);

// POST /shorten endpoint
app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortCode = Math.random().toString(36).substring(2, 8); // Generate a 6-character code
  
  const newUrl = new Url({ originalUrl, shortCode });
  await newUrl.save();
  
  res.json({ originalUrl, shortUrl: `http://localhost:3000/${shortCode}` });
});

// GET /:code endpoint
app.get('/:code', async (req, res) => {
  const { code } = req.params;
  const url = await Url.findOne({ shortCode: code });
  
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
