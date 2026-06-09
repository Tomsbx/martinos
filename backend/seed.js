require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/db');

const products = [
  {
    name: 'Tridente Martinos',
    description: 'CBC, LTC y Bacon Simple con una guarnición',
    price: 849,
    category: 'promo',
  },
  {
    name: 'Antojo Martinos',
    description: 'Cheddar, cebolla, ketchup y mostaza',
    price: 249,
    category: 'promo',
    image_url: '/images/Antojo.jpeg',
  },
  {
    name: 'Chesseburger Doble',
    description: 'Cheddar, cebolla, ketchup y mostaza',
    price: 450,
    category: 'burger',
    image_url: '/images/chesseburgerdoble.jpg',
  },
  {
    name: 'Chesseburger',
    description: 'Cheddar, cebolla, ketchup y mostaza',
    price: 350,
    category: 'burger',
    image_url: '/images/chessebruger.jpg',
  },
  {
    name: 'Bacon Doble',
    description: 'Cheddar, cebolla, bacon, ketchup y mostaza',
    price: 450,
    category: 'burger',
    image_url: '/images/bacondoble.jpg',
  },
  {
    name: 'Mila Burger Doble',
    description: 'Mila de pollo con queso cheddar, lechuga, tomate y salsa Martinos',
    price: 599,
    category: 'mila',
  },
  {
    name: 'Martinesa Doble',
    description: 'Mila de pollo con salsa de cheddar, bacon picado, cebolla caramelizada y dos huevos fritos',
    price: 550,
    category: 'mila',
  },
  {
    name: 'Martinesa',
    description: 'Mila de pollo con salsa de cheddar, bacon picado, cebolla caramelizada y huevo frito',
    price: 350,
    category: 'mila',
  },
  {
    name: 'Porción de papas fritas triple cocción',
    description: 'Papas fritas con cocción especial',
    price: 200,
    category: 'guarnicion',
  },
  {
    name: 'Papas agrandadas',
    description: 'Porción grande de papas fritas',
    price: 75,
    category: 'guarnicion',
  },
  {
    name: 'Papas Martinos',
    description: 'Papas con salsa cheddar',
    price: 99,
    category: 'guarnicion',
  },
  {
    name: 'Producto Test',
    description: 'Solo para pruebas',
    price: 10,
    category: 'promo',
  },
];

async function seed() {
  await pool.query('DELETE FROM products');
  console.log('Products cleared');

  for (const p of products) {
    await pool.query(
      `INSERT INTO products (name, description, price, image_url, category, available)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [p.name, p.description, p.price, p.image_url ?? null, p.category]
    );
  }
  console.log(`${products.length} products seeded`);

  const passwordHash = await bcrypt.hash('admin123', 10);
  await pool.query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO NOTHING`,
    ['admin', passwordHash]
  );
  console.log('Admin user seeded');

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
