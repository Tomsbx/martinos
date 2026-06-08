const API_URL = 'http://localhost:3001/api';

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function postCheckout(body) {
  const res = await fetch(`${API_URL}/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Error al procesar el pedido');
  return res.json();
}
