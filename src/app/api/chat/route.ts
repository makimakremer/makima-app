export async function POST(request: Request) {
  const { message } = await request.json();
  
  // Try OpenClaw connection
  const openclawUrl = process.env.OPENCLAW_URL;
  const openclawToken = process.env.OPENCLAW_TOKEN;
  
  if (openclawUrl && openclawToken) {
    // Real OpenClaw proxy
    try {
      const res = await fetch(openclawUrl, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${openclawToken}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      return Response.json({ reply: data.reply || data.message || data.text });
    } catch (error) {
      console.error('OpenClaw connection failed:', error);
    }
  }
  
  // Mock fallback for MVP
  const replies = [
    "Hey! Ich bin Makima, dein Voice AI Assistant. 🔗",
    "Interessant... erzähl mir mehr darüber.",
    "Das hab ich notiert. Brauchst du noch was?",
    "Gute Frage! Lass mich kurz nachdenken...",
    "Alles klar, wird erledigt! 👍",
  ];
  
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000)); // Simulate delay
  return Response.json({ reply: replies[Math.floor(Math.random() * replies.length)] });
}
