export function handleStripeWebhook(event, store) {
  if (event.type !== 'checkout.session.completed') {
    return { status: 'ignored' };
  }

  const session = event.data.object;
  const license = store.createLicense({
    email: session.customer_email,
    stripeSessionId: session.id,
    plan: session.metadata.plan,
  });

  return { status: 'created', license };
}
