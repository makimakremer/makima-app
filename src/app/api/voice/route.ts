export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get('audio') as Blob;
  
  // TODO: Implement actual voice processing with OpenClaw
  // For now, mock response
  await new Promise(r => setTimeout(r, 1500));
  
  return Response.json({
    transcript: "Voice Nachricht empfangen",
    reply: "Ich hab deine Sprachnachricht gehört! Voice-Verarbeitung wird noch eingerichtet. 🎤",
  });
}
