import math
"""
This takes in an adjacency matrix [][] and associated points from an X,Y cartesian coordinate plane
This outputs the shortest path from a point A to a point B from the matrix
Note that this shortest path must traverse nodes and is consequently not just the pythagorean theorem
"""
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
    Pythagorean Theorem for shortest distance
    c between two points, x^2 + y^2 = c^2
    """
    def distance(self, other):
        dx = self.X - other.X
        dy = self.Y - other.Y
        return math.sqrt(dx**2 + dy**2)

    """
    We need 0 radians/degrees to be north/up/+y
    So we setup the standard 0 = east/+x system
    Then swap x and y so 0 radians is up/+y
    """
    def angle(self, other):
        dx = self.X - other.X
        dy = self.Y - other.Y
        return math.degrees(math.atan2(dy, dx));

"""
adjmatrix = adjaceny matrix [][]
start = source vertex/node is an int, i.e. 0th node
end = ending vertex/node/point, is likewise an int
"""
def dijkstra(adjMatrix, start, end):
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
    #print(results)
    print("paths", path)
    #print (path[end])
    return path[end]

"""
Part two, calculating the distance and angles from the path and vertices
vertices is a list of points [point, point, ...]
path is the output from dijkstra 
string output is for convenience working with the arduino
sans arduino this would return "vectors"
"""
def vectify(vertices, path):
    output = ""
    vectors = []
    length = len(path)
    for i in range(length-1):
        angle = vertices[path[i]].angle(vertices[path[i+1]])
        magnitude = vertices[path[i]].distance(vertices[path[i+1]])
        output += "[" + str(int(angle)) + "," + str(int(magnitude)) +"]"
        vectors.append([[magnitude], [angle]])
    print("Vectors, [magnitude, direction], ...", output)
    return output

#Example
i = float("inf")
adj = [[i,i,4,5],
       [i,i,7,3],
       [4,7,i,i],
       [5,3,i,i]];
v = [Point(0,0),Point(4,7),Point(0,4),Point(5,0)]
p = dijkstra(adj, 3, 2);
vectify(v,p)
