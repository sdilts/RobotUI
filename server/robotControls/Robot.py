import requests
class Robot(object):

    def __init__(self, name, ip_addr, cur_location, cur_heading=0):
        self.name = name
        self.ip_addr = ip_addr
        self.cur_heading = cur_heading
        self.cur_location = cur_location

    def _build_command(self,command_list):
        s = ''
        for direction in command_list:
            print(type(direction.angle))
            print(type(s))
            s += str(direction.angle)
            s +=  ','
            s +=  str(direction.dist)
            # robot expects trailing comma:
            s += ','
        return s

    # formulate or send the command?
    def send_directions(self, directions):
        s = self._build_command(directions)
        url = 'http://' + self.ip_addr + '/mailbox/'+ s + '\n'
        print("sending command: %s" % url)
        try:
            r = requests.post(url)
            print("Command status code: %s" % r.status_code)
            return "Command completed Sucessfully"
        except requests.exceptions.Timeout:
            return "Requested server timed out"



# testing code:
from collections import namedtuple

ConnectionData = namedtuple("ConnectionData", "dist angle")
lst = []
for i in range(0, 10):
    lst.append(ConnectionData(dist=i+1, angle=i*10))

r = Robot("Fred", "10.200.39.155", "a")

print(r._build_command(lst))
r.send_command(lst)
