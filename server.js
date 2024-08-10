const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_URI = 'mongodb+srv://parikshit:12345@cluster0.iah05.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB Atlas connection string

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas', err));

// Define URL schema and model
const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true }
});

const Url = mongoose.model('Url', urlSchema);

// Shorten URL
app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  const id = Math.random().toString(36).substring(2, 8);
  
  try {
    const newUrl = new Url({ shortId: id, originalUrl: url });
    await newUrl.save();
    res.json({ shortUrl: `http://localhost:${PORT}/${id}` });
  } catch (error) {
    res.status(500).send('Error saving URL');
  }
});

// Redirect
app.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortId: id });
    if (urlDoc) {
      res.redirect(urlDoc.originalUrl);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving URL');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
