const API_URL = 'http://localhost:3000/api/books'; // Update if deployed

async function fetchBooks() {
  const res = await fetch(API_URL);
  const books = await res.json();
  displayBooks(books);
}

function displayBooks(books) {
  const list = document.getElementById('book-list');
  list.innerHTML = '';
  books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book-item';
    div.innerHTML = `
      <span><strong>${book.title}</strong> by ${book.author} (${book.year})</span>
      <div>
        <button onclick="deleteBook(${book.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, year })
  });

  e.target.reset();
  fetchBooks();
});

async function deleteBook(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchBooks();
}

fetchBooks();
npm install mongoose
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true }
});

module.exports = mongoose.model('Book', bookSchema);
const express = require('express');
const mongoose = require('mongoose');
const booksRouter = require('./routes/books');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/books', booksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/library?retryWrites=true&w=majority
const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// READ one
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.json(book);
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.json(book);
  } catch {
    res.status(400).json({ error: 'Invalid update' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch {
    res.status(400).json({ error: 'Invalid delete' });
  }
});

module.exports = router;
