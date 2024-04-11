# -*- coding: utf-8 -*-
from flask import Flask,jsonify,render_template,request
import json
from CS.main import run_community_search

app = Flask(__name__)


@app.route('/CommunitySearch/search', methods=['POST'])
def search_community():
    recv_data = request.get_data()
    if recv_data:
        print(recv_data)
        recv_data = json.loads(recv_data)
    else:
        print("receive data is empty")
        
    args = {
        "seed": 42,
        "show_validation_details": False,
        "dataset": "ACM_Time_5year_APA_AFA",
        "patience": 10,
        "remove_self_loop": False,
        "use_cache": "yes",
        "query_node": int(recv_data['param_q']),
        "weight": float(recv_data['param_w']),
        "community_size": int(recv_data['param_s'])
    }
    
    isOK, G_JSON = run_community_search(args)
    query_res = {
        "isOK": isOK,
        "G_JSON": G_JSON
    }
    return json.dumps(query_res)


@app.route('/')
def hello_world():
    return render_template('index.html')
 
 
if __name__ == '__main__':
    app.run()