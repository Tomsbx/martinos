import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../api/adminApi';

const STATUS_LABELS = {
  received: 'Recibido',
  preparing: 'En preparación',
  on_the_way: 'En camino',
  delivered: 'Entregado',
};

const STATUS_COLORS = {
  received: '#888888',
  preparing: '#E8900A',
  on_the_way: '#FF6B35',
  delivered: '#22C55E',
};

function formatPrice(price) {
  return '$ ' + Math.round(Number(price)).toLocaleString('es-UY');
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Comandas() {
  const [date, setDate] = useState(todayISO());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => getOrders(date).then(setOrders).catch(console.error);

    setLoading(true);
    fetchOrders().finally(() => setLoading(false));

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [date]);

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o)
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Comandas</h1>
        <input
          type="date"
          className="admin-date-input"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading">Cargando...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">Sin pedidos para esta fecha</div>
      ) : (
        <div className="comanda-list">
          {orders.map(order => {
            const statusColor = STATUS_COLORS[order.order_status];
            return (
              <div key={order.id} className="comanda-card">
                <div className="comanda-header">
                  <div className="comanda-header-left">
                    <span className="comanda-id">#{order.id}</span>
                    <span className="comanda-customer">{order.customer_name}</span>
                    <span className="comanda-phone">{order.customer_phone}</span>
                    <span className="comanda-time">{formatTime(order.created_at)}</span>
                  </div>
                  <span
                    className="comanda-status-badge"
                    style={{
                      background: statusColor + '22',
                      color: statusColor,
                      border: `1px solid ${statusColor}55`,
                    }}
                  >
                    {STATUS_LABELS[order.order_status]}
                  </span>
                </div>

                <div className="comanda-address">
                  <PinIcon />
                  {order.delivery_address}
                </div>

                <div className="comanda-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="comanda-item">
                      <span>{item.quantity} × {item.name}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="comanda-total">
                  Total: <strong style={{ color: 'var(--accent)' }}>{formatPrice(order.total)}</strong>
                </div>

                <div className="comanda-status-controls">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => {
                    const isActive = order.order_status === key;
                    const c = STATUS_COLORS[key];
                    return (
                      <button
                        key={key}
                        className={`comanda-status-btn${isActive ? ' active' : ''}`}
                        style={isActive ? { background: c + '22', color: c, borderColor: c + '66' } : {}}
                        onClick={() => handleStatusChange(order.id, key)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
