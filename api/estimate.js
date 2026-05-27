export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { from_amount } = req.query;

  if (!from_amount || from_amount < 20) {
    return res.status(400).json({ error: 'Monto minimo: $20 USD' });
  }

  try {
    const params = new URLSearchParams({
      from_currency: 'USD', to_currency: 'BTC',
      from_network: 'USD', to_network: 'BTC',
      from_amount: from_amount
    });

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const headers = { 'x-api-key': 'aba29bc3-2e85-481c-8e62-f409d0561684' };
    if (ip) headers['x-forwarded-for'] = ip;

    const response = await fetch('https://api-payments.guardarian.com/v1/estimate?' + params.toString(), { headers });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.message || 'Error al estimar' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};