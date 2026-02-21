#!/usr/bin/env python3.13
"""Faster-Whisper STT HTTP Server on port 8788"""
import io
import json
import os
import tempfile
from http.server import HTTPServer, BaseHTTPRequestHandler
from faster_whisper import WhisperModel

print("Loading Whisper small model...")
model = WhisperModel("small", device="cpu", compute_type="int8")
print("Model loaded.")


def extract_file_from_multipart(rfile, content_type, content_length):
    """Extract first file from multipart form data."""
    raw = rfile.read(content_length)
    boundary = content_type.split("boundary=")[1].strip()
    if boundary.startswith('"'):
        boundary = boundary[1:-1]
    boundary = boundary.encode()
    parts = raw.split(b"--" + boundary)
    for part in parts:
        if b"filename=" in part:
            # Find the blank line separating headers from body
            idx = part.find(b"\r\n\r\n")
            if idx == -1:
                continue
            body = part[idx + 4:]
            # Remove trailing \r\n
            if body.endswith(b"\r\n"):
                body = body[:-2]
            return body
    return None


class STTHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/transcribe":
            self.send_error(404)
            return
        content_type = self.headers.get("Content-Type", "")
        content_length = int(self.headers.get("Content-Length", 0))

        if "multipart/form-data" in content_type:
            audio_data = extract_file_from_multipart(self.rfile, content_type, content_length)
            if not audio_data:
                self.send_error(400, "No audio file found")
                return
        else:
            audio_data = self.rfile.read(content_length)

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            f.write(audio_data)
            tmp = f.name
        try:
            segments, info = model.transcribe(tmp, language="de")
            text = " ".join(s.text.strip() for s in segments)
        finally:
            os.unlink(tmp)

        resp = json.dumps({"text": text, "language": info.language}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(resp)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, fmt, *args):
        print(f"[STT] {args[0]}")

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8788), STTHandler)
    print("STT server running on :8788")
    server.serve_forever()
