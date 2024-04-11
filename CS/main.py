
import pickle as pkl



'''
This file is the backend entry, and the front section will call the 'run_community_search()' function in this file. 
Any method of calculating attribute similarity and community search methods can be used. 
The specific input and output format of the backend is as follows:

Input: 
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

Output: 
{'isOK': <integer, whether the query is successful>, 'G_JSON': <map, the query result>}

The structure of G_JSON
{
    'QueryNode': <query node id>,
    'snap_num': <the number of snapshots>,
    'static': {
        'NODES': [{
            'id': <integer, node id>, 
            'prob': <float, the attribute similarity>, 
            'name': <string, the name of this node>, 
            'type': <integer, the ground-truth category of this node>, 
            'community': <0 or 1, whether the node is in the resulting community>}, ...], 
        'LINKS': [{
            'source': <integer, node id>, 
            'target': <integer, node id>, 
            'type': <integer, the type of this edge>, 
            'score': <float, the edge stability>}, ...]
        },
    'dynamic': [{
        'NODES': [{
            'id': <integer, node id>, 
            'prob': <float, the attribute similarity>, 
            'name': <string, the name of this node>, 
            'type': <integer, the ground-truth category of this node>, 
            'community': <0 or 1, whether the node is in the resulting community>}, ...], 
        'LINKS': [{
            'source': <integer, node id>, 
            'target': <integer, node id>, 
            'type': <integer, the type of this edge>, 
            'score': <float, the edge stability>}, ...]
        }, ...]
}
'''



def run_community_search(args):
    # This is an example of backend input and output.
    
    G_JSON_path = "./CS/data/ACM_Time_5year_APA_AFA/query_result_1403.pkl"

    with open(G_JSON_path, "rb") as f:
        G_JSON = pkl.load(f)
        
    return True, G_JSON

