const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

const VALID_CATEGORIES = [
  'combo', 'burger', 'bebida', 'postre', 'envasado',
  'napoles', 'promo', 'mila', 'guarnicion',
];

const uploadsDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPG o PNG'));
    }
  },
});

function handleUpload(uploadFn) {
  return (req, res, next) => {
    uploadFn(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE')
          return res.status(400).json({ error: 'Imagen demasiado grande (máx. 5MB)' });
        return res.status(400).json({ error: err.message });
      }
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  };
}

// Public — only available products
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM products WHERE available = true ORDER BY category, name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin — all products regardless of available
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM products ORDER BY category, name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new product
router.post('/', auth, handleUpload(upload.single('image')), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ error: 'name es requerido' });
    if (!price || isNaN(Number(price)))
      return res.status(400).json({ error: 'price debe ser un número válido' });
    if (!VALID_CATEGORIES.includes(category))
      return res.status(400).json({ error: `category debe ser uno de: ${VALID_CATEGORIES.join(', ')}` });

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const desc = (description || '').trim() || null;

    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, image_url, category, available)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
      [name.trim(), desc, Number(price), image_url, category]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle available
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE products SET available = NOT available WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product image
router.patch('/:id/image', auth, handleUpload(upload.single('image')), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'image es requerido' });
    const image_url = `/uploads/${req.file.filename}`;
    const { rows } = await pool.query(
      `UPDATE products SET image_url = $1 WHERE id = $2 RETURNING *`,
      [image_url, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
