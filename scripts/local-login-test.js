// Use built-in fetch so this script doesn't need extra deps
(async () => {
  try {
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@tourmate.ai', password: 'Tourmate123!' }),
    });

    const data = await res.json();
    console.log('STATUS', res.status);
    console.log('DATA', JSON.stringify(data, null, 2));
    if (!res.ok) process.exit(1);
  } catch (err) {
    console.error('REQUEST ERROR', err?.message ?? err);
    process.exit(1);
  }
})();
