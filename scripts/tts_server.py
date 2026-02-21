#!/usr/bin/env python3.13
"""Piper TTS HTTP Server on port 8787"""
import io
import json
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler

MODEL_PATH = "/data/.openclaw/workspace/makima-app/models/piper/voice.onnx"

class TTSHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/tts":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))
        text = body.get("text", "")
        if not text:
            self.send_error(400, "Missing text")
            return
        proc = subprocess.run(
            ["python3.13", "-m", "piper", "--model", MODEL_PATH, "--output-raw"],
            input=text.encode(), capture_output=True, timeout=30,
        )
        if proc.returncode != 0:
            self.send_error(500, proc.stderr.decode())
            return
        # Build WAV from raw PCM (16-bit mono 22050Hz)
        import wave
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(22050)
            wf.writeframes(proc.stdout)
        wav_data = buf.getvalue()
        self.send_response(200)
        self.send_header("Content-Type", "audio/wav")
        self.send_header("Content-Length", str(len(wav_data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(wav_data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, fmt, *args):
        print(f"[TTS] {args[0]}")

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8787), TTSHandler)
    print("TTS server running on :8787")
    server.serve_forever()
