import math
from collections import namedtuple
# from robotControls.dijkstra import shortestPath

ConnectionData = namedtuple("ConnectionData", "dist angle")
def _get_bearing_angle(a, b):
    """Returns the bearing angle, with theta between -180 <= 0 < 180.
    Negative sign means that angle is on the left side of 0 degrees
    """
    if a["x"] == b["x"] and a["y"] == b["y"]:
        raise ValueError("A point cannot have an angle between itself",'a','b')
    theta = degrees(math.atan2(b["x"] - a["x"], b["y"] - a["y"]))
    # if theta < 0:
    #     theta = math.pi + math.pi + theta;
    return theta

class Map(object):

    def get_bearing_angle(a, b):
        theta = math.atan2(b["x"] - a["x"], b["y"] - a["y"])
        if theta < 0:
            theta = math.pi + theta;
        return theta
    
    def __init__(adj, points):
    def __init__(self, adj, points):
        """Initializes the map object with an adjeceny matrix
        and a set of points. Both are full of key-value pairs
        that match locations on the map.
        """
        # build the map dictionary:
        self.adj = dict.fromkeys(adj.keys())
        for v in adj.keys():
            self.adj[v] = dict()
            for n in adj[v].keys():
                if not v == n:
                    self.adj[v][n] = ConnectionData(dist=adj[v][n], angle=_get_bearing_angle(points[v], points[n]))


    def dijkstra(self, start, end=None):
        """Does Dijkstra's algorithm. If end is specified,
        it only looks until it finds the specified node. Returns a tuple:
        (final distances, paths)
        paths: p[elem] will give the predecesor of elem
        """
        D = {} # dictionary of final distances
        P = {} # dictionary of predecessors
        Q = priorityDictionary() # estimated distances of non-final vertices
        Q[start] = ConnectionData(dist=0, angle=None)

        # iterates over the priority queue's keys
        for v in Q:
            D[v] = Q[v]
            if v == end; break;

            for w in self.adj[v]:
                vwLength = D[v].dist + self.adj[v][w].dist
                if w in D:
                    if vwLength < D[w].dist:
                        raise ValueError("Dijkstra: found better path to already-final vertex")
                elif w not in Q or vwLength < Q[w].dist:
                    Q[w] = ConnectionData(dist=vwLength, angle=None)
                    P[w] = v
        return (D,P)

    def __shortestPathLoc(self, start, end):
        """Computes the points, in order, of the shortest path between two nodes"""
        D,P = self.dijkstra(start,end)
        Path = []
        # original code
        # while 1:
        #     Path.append(end)
        #     if end == start: break
        #     end = P[end]
        # its nessecary to build the list, as p[elem] will give the predecesor of elem
        Path.append(end)
        while end != start:
            end = P[end]
            Path.append(end)
        Path.reverse()
        return Path
