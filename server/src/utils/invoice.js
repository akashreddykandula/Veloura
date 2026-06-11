export function buildInvoice(order) {
  const lines = [
    `Invoice ${order.orderNumber}`,
    `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    `Customer: ${order.customer.name || order.shippingAddress.fullName}`,
    '',
    ...order.items.map((item) => `${item.name} x ${item.quantity} - INR ${item.price * item.quantity}`),
    '',
    `Subtotal: INR ${order.pricing.subtotal}`,
    `Discount: INR ${order.pricing.discount}`,
    `Shipping: INR ${order.pricing.shipping}`,
    `Tax: INR ${order.pricing.tax}`,
    `Total: INR ${order.pricing.total}`
  ];
  return Buffer.from(lines.join('\n'));
}
