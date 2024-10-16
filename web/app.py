from flask import Flask, request, jsonify, send_from_directory
import requests
import re
from bs4 import BeautifulSoup

app = Flask(__name__, static_url_path='', static_folder='static')

pattern = re.compile(r"\"(.*)\"", re.DOTALL)

def get_instagram_reel_caption(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the caption text in the meta tags
        meta = soup.find('meta', property='og:description')
        if meta:
            content = meta['content']
            match = pattern.search(content)

            if match:                
                return re.sub(r"\s*(#\w*)\s*", "", match.group(1))
            else:
                return content
        return None
    except Exception as e:
        print(f"Error fetching caption: {e}")
        return None

@app.route('/get-caption', methods=['POST'])
def get_caption():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    caption = get_instagram_reel_caption(url)
    if caption:
        return jsonify({'caption': caption})
    else:
        return jsonify({'error': 'Could not extract caption'}), 500

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)