import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import os
import time
import sys

PORT = 8000

# Ensure server serves files from script folder
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def start_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()

# Start server in a thread
threading.Thread(target=start_server, daemon=True).start()

# Open website
webbrowser.open(f"http://localhost:{PORT}/index.html")

# Keep script alive
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Server stopped.")
