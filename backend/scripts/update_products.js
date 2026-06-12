require('dotenv').config({ path: `${__dirname}/../.env` });
const pool = require('../src/db');

async function run() {
  // 1. Eliminar
  await pool.query(`DELETE FROM products WHERE name = 'Porción de papas fritas triple cocción'`);
  console.log('Deleted: Porción de papas fritas triple cocción');

  // 2. Actualizar existentes
  await pool.query(
    `UPDATE products SET description = 'Cheddar, cebolla, ketchup y mostaza con guarnición' WHERE name = 'Antojo Martinos'`
  );
  console.log('Updated: Antojo Martinos description');

  await pool.query(
    `UPDATE products SET name = 'Martinesa Simple' WHERE name = 'Martinesa'`
  );
  console.log('Renamed: Martinesa → Martinesa Simple');

  // 3. Insertar nuevos
  const inserts = [
    // promo
    ['3 Burgers Dobles + Guarnición',     '3 burgers dobles con una guarnición',          1049, '/images/MUNDIALISTA.jpeg', 'promo',     false],
    ['2 Burgers Dobles + 2 Guarniciones', '2 burgers dobles con 2 guarniciones',           799, '/images/MUNDIALISTA.jpeg', 'promo',     false],
    ['Burger del Mes + Guarnición',       'Burger del mes con guarnición',                 399, '/images/MUNDIALISTA.jpeg', 'promo',     false],
    // burger
    ['Bacon Simple',                      'Cheddar, cebolla, bacon, ketchup y mostaza',    350, '/images/BACON.jpg',        'burger',    true],
    ['CBC Simple',                        'Cheddar, cebolla, bacon caramelizado con salsa Martinos', 350, '/images/CBC.jpg', 'burger',   true],
    ['CBC Doble',                         'Cheddar, cebolla, bacon caramelizado con salsa Martinos', 450, '/images/CBC.jpg', 'burger',   true],
    ['LTC Simple',                        'Lechuga, tomate, cebolla con salsa Martinos',   350, '/images/LTC.jpg',         'burger',    true],
    ['LTC Doble',                         'Lechuga, tomate, cebolla con salsa Martinos',   450, '/images/LTC.jpg',         'burger',    true],
    ['CBO Simple',                        'Salsa barbacoa, cebolla crispy, bacon y cheddar', 350, '/images/CBO.jpg',       'burger',    true],
    ['CBO Doble',                         'Salsa barbacoa, cebolla crispy, bacon y cheddar', 450, '/images/CBO.jpg',       'burger',    true],
    ['Burger del Mes - La Trionda',       'Pan estilo pelota de fútbol, lactonesa de ajo y perejil, queso provolone, huevo frito, lechuga, tomate y bacon', 500, '/images/TRIONDA.jpg', 'burger', true],
    // mila
    ['Martinesa Doble',                   '2 milas de pollo con salsa de cheddar, bacon picado, cebolla caramelizada y 2 huevos fritos', 549, '/images/MARTINESA_DOBLE.jpg', 'mila', true],
  ];

  for (const [name, description, price, image_url, category, available] of inserts) {
    await pool.query(
      `INSERT INTO products (name, description, price, image_url, category, available)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, description, price, image_url, category, available]
    );
    console.log(`Inserted: ${name}`);
  }

  await pool.end();
  console.log('Done.');
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
