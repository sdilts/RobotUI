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
        return math.degrees(math.atan2(dy, dx))