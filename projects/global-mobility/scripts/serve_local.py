#!/usr/bin/env python3
"""Serve the project locally without external dependencies."""

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
port = 8080
print(f"Serving {ROOT} at http://localhost:{port}")
ThreadingHTTPServer(("127.0.0.1", port), SimpleHTTPRequestHandler).serve_forever()
