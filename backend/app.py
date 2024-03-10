from flask import Flask
from flask_jsonrpc import JSONRPC
from typing import Dict, List
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
jsonrpc = JSONRPC(app, '/rpc', enable_web_browsable_api=True)
chat_history = []

@jsonrpc.method('App.add')
def add(a: int, b: int) -> Dict[str, int]:
    return {"result": a + b}

@app.route('/')
def hello():
    return 'Hello, World!'

@jsonrpc.method('Chat.sendMessage')
def send_message(username: str, message: str) -> Dict[str, str]:
    global chat_history
    chat_history.append({'username': username, 'message': message})
    return {'status': 'success', 'message': f'Message sent by {username}'}

@jsonrpc.method('Chat.getMessages')
def get_messages() -> List[Dict[str, str]]:
    return chat_history

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')