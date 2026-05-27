export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let from_amount, email, rawBody;
  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    rawBody = Buffer.concat(buffers).toString();
    const body = JSON.parse(rawBody || '{}');
    from_amount = body.from_amount;
    email = body.email;
  } catch (e) {
    return res.status(400).json({ error: 'Body invalido', debug: e.message, raw: rawBody });
  }

  if (!from_amount || from_amount < 20) {
    return res.status(400).json({ error: 'Monto minimo 20 USD' });
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': 'aba29bc3-2e85-481c-8e62-f409d0561684'
    };
    if (ip) headers['x-forwarded-for'] = ip;

    const response = await fetch('https://api-payments.guardarian.com/v1/transaction', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from_amount: from_amount,
        from_currency: 'USD',
        to_currency: 'BTC',
        from_network: 'USD',
        to_network: 'BTC',
        payout_info: {
          payout_address: '14GjaVeCyQwXLxSmVhMi9tbmXDCFt1G2Zd',
          skip_choose_payout_address: true
        },
        customer: {
          contact_info: { email: email || 'cliente@3clicads.com' }
        },
        redirects: {
          successful: 'https://www.3clicads.com/',
          cancelled: 'https://www.3clicads.com/',
          failed: 'https://www.3clicads.com/'
        },
        locale: 'es'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || data.error || 'Error al crear transaccion' });
    }

    res.json({
      redirect_url: data.redirect_url || `https://payments.guardarian.com/checkout?tid=${data.id}&auth_token=${data.preauth_token}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};