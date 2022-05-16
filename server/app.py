from firebase_admin import auth,credentials,firestore
from flask import Flask, request
from flask_cors import CORS
from itsdangerous import exc
import firebase_admin
import json


cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)
CORS(app)

def verifyUser(token):
    decoded_token = auth.verify_id_token(token)
    uid = decoded_token['uid']
    return uid

@app.route("/")
def main():
    return "Hello", 200

# returns user level and exp
@app.route("/level", methods=['GET'])
def get_level():
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        print(uid)
        doc_ref = db.collection(u'users').document(uid)
        doc = doc_ref.get().to_dict()
        
        return json.dumps({'level': doc["level"], 'xp': doc["exp"]}), 200
    except Exception as e:
        return "Failed", 400

# Signs up a user
@app.route("/signup", methods=['GET'])
def user_signup():
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        print(uid)
        doc_ref = db.collection(u'users').document(uid)
        doc = doc_ref.get()
        if doc.exists:
            return "Signed In", 200
        else:
            doc_ref.set({      
                "friends":[],
                "tasks":[],
                "exp": 0,
                "level":1
            })
        return "Signed Up", 200
    except Exception as e:
       
        return "Failed", 400   

#gets all of a users tasks
@app.route("/tasks", methods=['GET'])
def user_tasks():
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        users_ref = db.collection(u'users').document(uid)
        doc = users_ref.get().to_dict()
        return json.dumps(doc["tasks"]), 200
    except Exception as e:
        print(e)
        return "Failed", 400

#updates a task
@app.route("/tasks/update/<taskid>", methods=['PUT'])
def update_task(taskid):
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        data = request.json
        users_ref = db.collection(u'users').document(uid)
        doc = users_ref.get().to_dict()
        tasks = doc["tasks"]
        level = doc["level"]
        exp = doc["exp"]
        for index,task in enumerate(tasks):    
            if task["id"]==str(taskid):
                if data["status"] == 2 and task["status"] != 2:
                    exp+=15
                    testXp=(level+1)**3 - exp
                    # print(exp, level)
                    if testXp < 0:
                        exp = testXp * -1
                        # exp*=-1
                        level+=1
                    users_ref.update({u'exp':exp})
                    users_ref.update({u'level':level})
                tasks[index]=data
        users_ref.update({u'tasks':tasks})
        
        return '', 200
    except Exception as e:
        print(e)
        return "Failed", 400

#create new task
@app.route("/tasks/create", methods=['POST'])
def create_task():
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        data = request.json
        doc = db.collection(u'users').document(uid)
        doc.update({u'tasks':firestore.ArrayUnion([data])})
        return '', 201
    except:
        return "Failed", 400

#read a task
@app.route("/task/<taskid>", methods=['GET'])
def read_task(taskid):
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        users_ref = db.collection(u'users').document(uid)
        doc = users_ref.get().to_dict()
        for task in doc["tasks"]:
            if task["id"]==str(taskid):
                # print(task, taskid)
                return json.dumps(task), 200
        # print("This other part returns too")
        return '', 200
    except Exception as e:
        print(e)
        return "Failed", 400

#delete a task
@app.route("/tasks/delete/<taskid>", methods=['DELETE'])
def delete_task(taskid):
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        users_ref = db.collection(u'users').document(uid)
        doc = users_ref.get().to_dict()
        newTasks = doc["tasks"]
        for task in newTasks:
            if task["id"]==str(taskid):
                newTasks.remove(task)
        users_ref.update({u'tasks':newTasks})
        return '', 200
    except Exception as e:
        print(e)
        return "Failed", 400

#add friend
@app.route("/friends/add/<id>")
def add_friend(id):
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        users_ref = db.collection(u'users').document(uid)
        doc = users_ref.get().to_dict()
        return doc["friends"][doc["friends"].index(id)], 200
    except:
        return "Failed", 400

#remove friend
@app.route("/friends/remove/<id>")
def remove_friend(id):
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        users_ref = db.collection(u'users').document(uid)
        doc = users_ref.get().to_dict()
        newFriends = doc["friends"]
        newFriends.remove(newFriends.index(id))
        users_ref.update({u'friend':newFriends})
        return "Removed", 200
    except:
        return "Failed", 400

#reads friends list
@app.route("/friends/read")
def friends_list():
    token = request.headers['AUTHORIZATION']
    try:
        uid = verifyUser(token)
        users_ref = db.collection(u'users').document(uid)
        doc = users_ref.get()
        return f'{doc.to_dict()["friends"]}', 200
    except:
        return "Failed", 400


if __name__ == "__main__":
    app.run(debug=True)