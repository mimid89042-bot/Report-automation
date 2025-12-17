import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import os
import time

PORT = 8000

# Make sure server runs from the folder where the script is
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def start_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()

# Start the server in a separate thread
threading.Thread(target=start_server, daemon=True).start()

# Open the browser
webbrowser.open(f"http://localhost:{PORT}/index.html")

# Keep script running indefinitely (since no console)
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Server stopped.")
