import math
from collections import deque
from priodict import priorityDictionary
"""
This takes in an adjacency matrix [][] and associated points from an X,Y cartesian coordinate plane
This outputs the shortest path from a point A to a point B from the matrix
Note that this shortest path must traverse nodes and is consequently not just the pythagorean theorem
"""
class Pathfinder(object):
    
    """
    Not yet formatted
    """
    def __init__(self, adj, points):
        self.convertToNum = dict();
        self.convertFromNum = dict()
        self.matrix = adj
        
        index = 0;
        self.vertices = dict();
        print points
        for key in points.keys():
            value = points[key]
            self.vertices[key] = self.Point(value["x"], value["y"])
            index = index + 1
        inf = float("inf")

        self.curLocation = next(iter(points))
        
        print "the verticies are:"
        print self.vertices

        print "the matrix is: "
        print self.matrix
    
    class Point(object):
        """Creates a point on a cartesian oordinate plane with values x and y."""
        def __init__(self, x, y):
            """Defines x and y variables"""
            self.X = x
            self.Y = y
        #I never actually verified that this worked
        def __str__(self):
            return "Point(%s,%s)"%(self.X, self.Y)
        #Cartesian rectangulaar coordinate X value
        def getX(self):
            return self.X
        #Cartesian rectangulaar coordinate Y value
        def getY(self):
            return self.Y

        """
        We need 0 radians/degrees to be north/up/+y
        So we setup the standard 0 = east/+x system
        Then swap x and y so 0 radians is up/+y
        """
        def angle(self, other):
            dx = self.X - other.X
            dy = self.Y - other.Y
            return math.degrees(math.atan2(dy, dx));


    def Dijkstra(self,G,start,end=None):
	"""
	Find shortest paths from the  start vertex to all vertices nearer than or equal to the end.

	The input graph G is assumed to have the following representation:
	A vertex can be any object that can be used as an index into a dictionary.
	G is a dictionary, indexed by vertices.  For any vertex v, G[v] is itself a dictionary,
	indexed by the neighbors of v.  For any edge v->w, G[v][w] is the length of the edge.
	This is related to the representation in <http://www.python.org/doc/essays/graphs.html>
	where Guido van Rossum suggests representing graphs as dictionaries mapping vertices
	to lists of outgoing edges, however dictionaries of edges have many advantages over lists:
	they can store extra information (here, the lengths), they support fast existence tests,
	and they allow easy modification of the graph structure by edge insertion and removal.
	Such modifications are not needed here but are important in many other graph algorithms.
	Since dictionaries obey iterator protocol, a graph represented as described here could
	be handed without modification to an algorithm expecting Guido's graph representation.

	Of course, G and G[v] need not be actual Python dict objects, they can be any other
	type of object that obeys dict protocol, for instance one could use a wrapper in which vertices
	are URLs of web pages and a call to G[v] loads the web page and finds its outgoing links.
	
	The output is a pair (D,P) where D[v] is the distance from start to v and P[v] is the
	predecessor of v along the shortest path from s to v.
	
	Dijkstra's algorithm is only guaranteed to work correctly when all edge lengths are positive.
	This code does not verify this property for all edges (only the edges examined until the end
	vertex is reached), but will correctly compute shortest paths even for some graphs with negative
	edges, and will raise an exception if it discovers that a negative edge has caused it to make a mistake.
	"""

	D = {}	# dictionary of final distances
	P = {}	# dictionary of predecessors
	Q = priorityDictionary()	# estimated distances of non-final vertices
	Q[start] = 0
	
	for v in Q:
		D[v] = Q[v]
		if v == end: break
		
		for w in G[v]:
			vwLength = D[v] + G[v][w]
			if w in D:
				if vwLength < D[w]:
					raise ValueError, "Dijkstra: found better path to already-final vertex"
			elif w not in Q or vwLength < Q[w]:
				Q[w] = vwLength
				P[w] = v
	
	return (D,P)
			
    def shortestPath(self,G,start,end):
	"""
	Find a single shortest path from the given start vertex to the given end vertex.
	The input has the same conventions as Dijkstra().
	The output is a list of the vertices in order along the shortest path.
	"""

	D,P = self.Dijkstra(G,start,end)
	Path = []
	while 1:
		Path.append(end)
		if end == start: break
		end = P[end]
	Path.reverse()
	return Path

    
    def get_location(self):
        return self.curLocation

    def goto_location(self, dest):
        print "location:"
        print self.curLocation
        # path = self.dijkstra(self.matrix, self.curLocation, dest)
        path = self.shortestPath(self.matrix,self.curLocation,dest)
        if(len(path) > 0):
            str = self.vectify(self.vertices, path)
            self.curLocation = dest
            print str
            return str
            
    
    """
    adjmatrix = adjaceny matrix [][]
    start = source vertex/node is an int, i.e. 0th node
    end = ending vertex/node/point, is likewise an int
    """
    def dijkstra(self, adjMatrix, start, end):
        width = len(adjMatrix[0])
        magnitude = []
        work = []
        visited = []
        path = []
        for i in range(width):
            magnitude.append(float("inf"))
            work.append(float("inf"))
            visited.append(False)
            path.append([start])
        magnitude[start] = 0
        work[start] = 0
        all_visited = False
        while not all_visited:
            current = work.index(min(work))
            for i in range(width):
                if (adjMatrix[current][i] >= 0) and not visited[i] and ((magnitude[current] + adjMatrix[current][i]) < magnitude[i]):
                    magnitude[i] = magnitude[current] + adjMatrix[current][i]
                    path[i] = path[current] + [i]
                    work[i] = magnitude[current] + adjMatrix[current][i]
            work[current] = float("inf")
            visited[current] = True
            all_visited = True
            for vertex in visited:
                all_visited = all_visited and vertex
        print("paths", path)
        return path[end]

    
    """
    Part two, calculating the magnitudes and angles from the path and vertices
    Vertices is a list of points [point, point, ...]
    Path is the output from dijkstra 
    String output is for convenience working with the arduino
    Sans arduino this would return "vectors"
    """
    def vectify(self, vertices, path):
        print "Path:"
        print path
        output = ""
        vectors = []
        length = len(path)
        for i in range(length-1):
            angle = vertices[path[i]].angle(vertices[path[i+1]])
            magnitude = self.matrix[path[i]][path[i+1]]
            output += str(int(angle)) + "," + str(int(magnitude)) +","
            vectors.append([[magnitude], [angle]])
        print("Vectors, [magnitude, direction], ...", output)
        return output

    
    # def vectify(self, curLocation, vertices, path):
    #     print path
    #     output = ""
    #     vectors = []
    #     length = len(path)
    #     angle = vertices[curLocation].angle(vertices[path[0]])
    #     magnitude = self.matrix[curLocation][path[0]]
    #     output += str(int(angle)) + "," + str(int(magnitude)) + ","

    #     for i in range(1, length-1):
    #         angle = vertices[path[i]].angle(vertices[path[i+1]])
    #         magnitude = self.matrix[i][i+1]
    #         output += str(int(angle)) + "," + str(int(magnitude)) + ","
    #         vectors.append([[magnitude], [angle]])

    #     # i = length -2
    #     # angle = vertices[path[i]].angle(vertices[path[i+1]])
    #     # magnitude = self.matrix[i][i+1]
    #     # output += str(int(angle)) + "," + str(int(magnitude))
    #     # vectors.append([[magnitude], [angle]])
    #     print("Vectors, [magnitude, direction], ...", output)
    #     return output

    # #Example
    # i = float("inf")
    # adj = [[i,i,4,5],[i,i,7,3],[4,7,i,i],[5,3,i,i]];
    # v = [selfPoint(0,0),Point(4,7),Point(0,4),Point(5,0)]
    # p = dijkstra(adj, 3, 2);
    # vectify(v,p)