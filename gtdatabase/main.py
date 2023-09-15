from dotenv import load_dotenv
from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import MySQLdb

# Load environment variables from the .env file
load_dotenv() 

connection = MySQLdb.connect(
    host=os.getenv("DATABASE_HOST"),
    user=os.getenv("DATABASE_USERNAME"),
    passwd=os.getenv("DATABASE_PASSWORD"),
    db=os.getenv("DATABASE"),
    autocommit=True,
)


# Define the handler class for handling HTTP requests
class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/count':
            try:
                cursor = connection.cursor()
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                table_count = len(tables)

                self.send_response(200)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(f"Total tables in the database: {table_count}".encode())

            except Exception as e:
                self.send_response(500)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode()) 

    def do_POST(self):
        if self.path == '/api/match': 


    # Override log_message method to suppress log messages
    def log_message(self, format, *args):
        pass

# Create an HTTP server and specify the port
server = HTTPServer(('localhost', 8080), RequestHandler)

try:
    print("Server listening on port 8080...")
    server.serve_forever()
except KeyboardInterrupt:
    print("Server stopped.")
    server.server_close()
