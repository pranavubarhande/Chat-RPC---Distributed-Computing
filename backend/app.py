from flask import Flask
from flask_jsonrpc import JSONRPC
from typing import Dict, List, Any, Union
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from flask_caching import Cache

app = Flask(__name__)
CORS(app)
jsonrpc = JSONRPC(app, '/rpc', enable_web_browsable_api=True)
cache = Cache(app)
client = MongoClient('mongodb://localhost:27017/')
db = client['chatrpc']
users_collection = db['users']
group_collection = db['group']

chat_history = []

if 'chatrpc' not in client.list_database_names():
    # Create the database and collections
    db.create_collection('users')
    db.create_collection('group')

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

@jsonrpc.method('User.signup')
def signup(name: str, mobile_no: str, password: str) -> Dict[str, str]:
    # Check if user already exists
    if users_collection.find_one({'mobileNo': mobile_no}):
        return {'status': 'error', 'message': 'User already exists!'}

    # Create new user
    user = {
        'name': name,
        'mobileNo': mobile_no,
        'password': password
    }
    users_collection.insert_one(user)
    
    return {'status': 'success', 'message': 'User signed up successfully!'}

@jsonrpc.method('User.signin')
def signin(mobile_no: str, password: str) -> Dict[str, str]:
    # Check if user exists
    user = users_collection.find_one({'mobileNo': mobile_no, 'password': password})
    if user:
        return {'status': 'success', 'message': 'User signed in successfully!'}
    else:
        return {'status': 'error', 'message': 'Invalid mobile number or password.'}

@jsonrpc.method('Group.create')
def createGroup(creatorid: str, name: str) -> Dict[str, str]:
    group = {
        'creatorid': creatorid,
        'groupname': name
    }
    u = group_collection.insert_one(group)
    
    return {'status': 'success', 'message': "successful"}

@jsonrpc.method('Group.update')
def update_group(group_id: str, file_string: str) -> Dict[str, str]:
    # Check if group exists
    group = group_collection.find_one({'_id': ObjectId(group_id)})
    if group:
        # Update the group document with the file string
        group_collection.update_one({'_id': ObjectId(group_id)}, {'$set': {'file_string': file_string}})
        cache.delete_memoized(get_group_file_string_by_id, group_id=group_id)
        return {'status': 'success', 'message': 'Group updated successfully!'}
    else:
        return {'status': 'error', 'message': 'Group not found.'}

@jsonrpc.method('Group.delete')
def delete_group(group_id: str) -> Dict[str, str]:
    group = group_collection.find_one({'_id': ObjectId(group_id)})
    if group:
        group_collection.delete_one({'_id': ObjectId(group_id)})
        return {'status': 'success', 'message': 'Group deleted successfully!'}
    else:
        return {'status': 'error', 'message': 'Group not found.'}

@jsonrpc.method('Group.getGroupById')
def get_group_by_id(group_id: str) -> Dict[str, str]:
    # Retrieve group by ID
    group = group_collection.find_one({'_id': ObjectId(group_id)})
    if group:
        return {'status': 'success', 'message': 'Group found', 'group': str(group)}
    else:
        return {'status': 'error', 'message': 'Group not found.'}

@jsonrpc.method('Group.getGroupFileStringById')
@cache.memoize(timeout=300)
def get_group_file_string_by_id(group_id: str) -> Dict[str, str]:
    # Retrieve group by ID
    group = group_collection.find_one({'_id': ObjectId(group_id)})
    if group:
        file_string = group.get('file_string', '')
        return {'status': 'success', 'message': 'File string retrieved successfully', 'file_string': file_string}
    else:
        return {'status': 'error', 'message': 'Group not found.'}

@jsonrpc.method('Group.getAllGroupsByUserId')
def get_all_groups_by_user_id(user_id: str) -> Dict[str, Union[str, List[Dict[str, Any]]]]:
    groups = group_collection.find({'creatorid': user_id})

    groups_list = [{**group, '_id': str(group['_id'])} for group in groups]

    if groups_list:
        return {'status': 'success', 'message': 'Groups retrieved successfully', 'groups': groups_list}
    else:
        return {'status': 'error', 'message': 'No groups found for the given user ID.'}

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')