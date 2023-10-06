from http.server import HTTPServer, BaseHTTPRequestHandler
import requests
from http import HTTPStatus
import os


class OauthHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        print(self.requestline)
        
    def do_POST(self):
        from urllib.parse import urlparse, parse_qs
        parsed_path = urlparse(self.path)
        if parsed_path.path != "/oauth/token":
            return
        query = parse_qs(parsed_path.query)
        code, = query["code"]
        data = {
            "client_id": int(query["client_id"][0]),
            "client_secret": os.environ["STRAVA_SECRET"],
            "code": code,
            "grant_type": "authorization_code",
        }
        print(data)
        response = requests.post("https://www.strava.com/oauth/token", data=data)
        result = response.json()
        print(result)
        if "errors" in result:
            self.send_error(HTTPStatus.BAD_REQUEST, result["message"])
            return
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(response.content)
        # return {'accessToken': accessToken}
        


server_address = ('', 8765)
httpd = HTTPServer(server_address, OauthHTTPRequestHandler)
httpd.serve_forever()

