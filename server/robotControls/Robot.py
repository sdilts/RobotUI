class Robot(object):

    def __init__(self, name, ip_addr, cur_location, cur_heading=0):
        self.name = name
        self.ip_addr = ip_addr
        self.cur_heading = cur_heading
        self.cur_location = cur_location
