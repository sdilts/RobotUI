import math
from collections import namedtuple

ConnectionData = namedtuple("ConnectionData", "dist angle")

class Map(object):

    def get_bearing_angle(a, b):
        theta = math.atan2(b["x"] - a["x"], b["y"] - a["y"])
        if theta < 0:
            theta = math.pi + theta;
        return theta
    
    def __init__(adj, points):
        # build the map dictionary:
        self.adj = dict.fromkeys(adj.keys(), dict())
        for v in adj.keys():
            for n in adj[v].keys():
                self.adj[v][n] = ConnectionData(dist=adj[v][n], angle=get_bearing_angle(points[v], points[n]))