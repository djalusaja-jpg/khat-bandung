export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyq0dKqpEEE3OX9SkLD024g3Lk631pYGZE3hFroKqSv6OrYq9EsRSnZqMWTa4ALUxxI/exec';

    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });

    const result = await response.text();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
