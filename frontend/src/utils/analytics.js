const GA_ID = 'G-MVBFWJ70V4';

function gtag(...args) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

export function trackAddToCart(item) {
  gtag('event', 'add_to_cart', {
    currency: 'UYU',
    value: item.price * item.quantity,
    items: [{
      item_id: String(item.product_id),
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }],
  });
}

export function trackBeginCheckout(items, total) {
  gtag('event', 'begin_checkout', {
    currency: 'UYU',
    value: total,
    items: items.map(i => ({
      item_id: String(i.product_id),
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}

export function trackPurchase(orderId, items, total) {
  gtag('event', 'purchase', {
    transaction_id: orderId,
    currency: 'UYU',
    value: total,
    items: items.map(i => ({
      item_id: String(i.product_id),
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}
