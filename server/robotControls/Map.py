import math
from robotControls.priodict import priorityDictionary
from robotControls.Robot import Robot
from collections import namedtuple
# from robotControls.dijkstra import shortestPath

ConnectionData = namedtuple("ConnectionData", "dist angle")
# might need this?
# class ConnectionData(namedtuple("ConnectionData", "dist angle")):
#     def __cmp__(self, other):
#         return self.dist - other.dist

def _get_bearing_angle(a, b):
    """Returns the bearing angle, with theta between -180 <= 0 < 180.
    Negative sign means that angle is on the left side of 0 degrees
    """
    if a["x"] == b["x"] and a["y"] == b["y"]:
        raise ValueError("A point cannot have an angle between itself",'a','b')
    # calc theta:
    return (math.degrees(math.atan2(b["x"] - a["x"], b["y"] - a["y"])) + 180) % 360
    # if theta < 0:
    #     theta = math.pi + math.pi + theta;
    # return theta

def _compute_steering_angle(to, fro):
    """Computes the steeering angle from previous heading a to new heading b.
    Assumes that angles are in degrees.
    """
    return ((((fro - to) % 360) + 540) % 360) - 180

class Map(object):

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
                    self.adj[v][n] = ConnectionData(dist=int(adj[v][n]), angle=_get_bearing_angle(points[v], points[n]))
        print("adj matrix:")
        print(self.adj)


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

        # iterates over the priority queue's keys, remove as you go.
        for v in Q:
            D[v] = Q[v]
            if v == end: break;

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
        if not (end in P):
            raise ValueError("Cannot reach the node %s" % end)
        Path = []
        Path.append(end)
        while end != start:
            end = P[end]
            Path.append(end)
        Path.reverse()
        return Path

    def get_directions(self, robot, end):
        """Computes the points, in order, of the shortest path
        between two nodes and the angle the robot needs to turn.
        Positive angle; turn clockwise
        negative angle: counterclockwise
        """
        if end in self.adj:
            p = []
            named_path = self.__shortestPathLoc(robot.cur_location, end)
            print("Named path:")
            print(named_path)

            iterator = iter(named_path)
            latest_heading = robot.cur_heading
            print("Currently facing: %d" % latest_heading)
            last_visit = next(iterator)
            for loc in iterator:
                edge = self.adj[last_visit][loc]
                print("Target dir: %d" % edge.angle)
                angle = _compute_steering_angle(latest_heading, edge.angle)
                p.append(ConnectionData(dist=edge.dist, angle=angle))
                print("Turning with: %d" % p[-1].angle)
                latest_heading = edge.angle
                print("Currently facing: %d" % latest_heading)
                last_visit = loc
                p.reverse()
                return (p, latest_heading)
        # if said destination doesn't exist:
        raise ValueError("Point %s does not exist" % end)
    # return ([], robot.cur_heading)
