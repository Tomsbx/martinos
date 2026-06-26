const API_URL = '/api';
const TOKEN_KEY = 'martinos_admin_token';

function authHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonHeaders() {
  return { 'Content-Type': 'application/json', ...authHeader() };
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Credenciales incorrectas');
  return res.json();
}

export async function getOrders(date) {
  const url = date ? `${API_URL}/orders?date=${date}` : `${API_URL}/orders`;
  const res = await fetch(url, { headers: authHeader() });
  if (!res.ok) throw new Error('Error al cargar comandas');
  return res.json();
}

export async function updateOrderStatus(id, order_status) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify({ order_status }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado');
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function toggleProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}/toggle`, {
    method: 'PATCH',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  return res.json();
}

export async function createManualOrder(data) {
  const res = await fetch(`${API_URL}/orders/manual`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Error al crear la comanda');
  }
  return res.json();
}

export async function getAllProductsAdmin() {
  const res = await fetch(`${API_URL}/products/admin/all`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function createProduct(formData) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: authHeader(),
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Error al crear producto');
  }
  return res.json();
}

export async function updateProductImage(id, formData) {
  const res = await fetch(`${API_URL}/products/${id}/image`, {
    method: 'PATCH',
    headers: authHeader(),
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Error al actualizar imagen');
  }
  return res.json();
}
