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

function CashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function PaymentInfo({ method, status }) {
  const isCard = method === 'tarjeta';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
      {isCard ? <CardIcon /> : <CashIcon />}
      <span style={{ color: 'var(--text)' }}>{isCard ? 'Tarjeta' : 'Efectivo'}</span>
      {isCard && (
        <span style={{
          fontSize: 11,
          padding: '1px 7px',
          borderRadius: 99,
          background: status === 'paid' ? '#22C55E22' : '#F8717122',
          color: status === 'paid' ? '#22C55E' : '#F87171',
          border: `1px solid ${status === 'paid' ? '#22C55E55' : '#F8717155'}`,
        }}>
          {status === 'paid' ? 'Aprobado' : 'Rechazado'}
        </span>
      )}
    </div>
  );
}

const TICKET_HR = { border: 'none', borderTop: '1px dashed #000', margin: '6px 0' };

function PrintTicket({ order }) {
  const isDelivery = order.delivery_address !== 'Retiro en local';
  const dt = new Date(order.created_at);
  const dateStr = dt.toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = dt.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', hour12: false });
  const customerName = order.customer_name || 'Pedido mostrador';

  return (
    <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 11, color: '#000', lineHeight: 1.6, padding: '4mm 3mm' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 14, marginBottom: 2 }}>
        MARTINOS GRILL
      </div>
      <hr style={TICKET_HR} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span>COMANDA #{order.id}</span>
        <span>{timeStr}</span>
      </div>
      <div style={{ fontSize: 10 }}>{dateStr}</div>

      <hr style={TICKET_HR} />

      {isDelivery ? (
        <>
          <div style={{ fontWeight: 'bold' }}>DELIVERY</div>
          <div>{order.delivery_address}</div>
        </>
      ) : (
        <div style={{ fontWeight: 'bold' }}>RETIRO EN LOCAL</div>
      )}

      {customerName !== 'Pedido mostrador' && (
        <div style={{ marginTop: 4 }}>Cliente: {customerName}</div>
      )}
      {order.customer_phone && (
        <div>Tel: {order.customer_phone}</div>
      )}

      <hr style={TICKET_HR} />

      {order.items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          <span>{item.quantity} x {item.name}</span>
          <span style={{ flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</span>
        </div>
      ))}

      <hr style={TICKET_HR} />

      {order.notes && (
        <>
          <div style={{ fontWeight: 'bold' }}>INDICACIONES:</div>
          <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, marginTop: 2 }}>
            {order.notes}
          </div>
          <hr style={TICKET_HR} />
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 13, marginTop: 2 }}>
        <span>TOTAL</span>
        <span>{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}

export default function Comandas() {
  const [date, setDate] = useState(todayISO());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printingOrder, setPrintingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = () => getOrders(date).then(setOrders).catch(console.error);

    setLoading(true);
    fetchOrders().finally(() => setLoading(false));

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [date]);

  useEffect(() => {
    if (!printingOrder) return;
    const cleanup = () => setPrintingOrder(null);
    window.addEventListener('afterprint', cleanup);
    window.print();
    return () => window.removeEventListener('afterprint', cleanup);
  }, [printingOrder]);

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

                <PaymentInfo method={order.payment_method} status={order.payment_status} />

                {order.notes && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span>{order.notes}</span>
                  </div>
                )}

                <div className="comanda-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="comanda-item">
                      <span>{item.quantity} × {item.name}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="comanda-total">
                  Total: <strong style={{ color: '#ffffff' }}>{formatPrice(order.total)}</strong>
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
                <button
                  className="comanda-status-btn"
                  style={{
                    width: '100%',
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    color: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    background: 'rgba(232, 144, 10, 0.08)',
                  }}
                  onClick={() => setPrintingOrder(order)}
                >
                  <PrinterIcon />
                  Imprimir
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div id="print-ticket">
        {printingOrder && <PrintTicket order={printingOrder} />}
      </div>
    </div>
  );
}
