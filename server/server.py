import json
import math
import requests
import robotControls.Map as Map
from robotControls.Robot import Robot
# from flask import Flask, render_template, flash, request
from wtforms import Form, TextField, TextAreaField, validators, StringField, SubmitField
from flask import Flask, request, Response, render_template, flash
from functools import wraps

app = Flask(__name__)
app.config.from_object(__name__)
app.config['SECRET_KEY'] = '7d441f27d441f27567d441f2b6176a'

hiawatha = None

r = Robot("Fred", "10.200.39.155", "a")


def check_auth(username, password):
    """This function is called to check if a username /
    password combination is valid.
    """
    # This is bad: fix if actually going to use on a larger scale:
    return username == 'admin' and password == 'secret'

def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated
"""
We need 0 radians/degrees to be north/up/+y
So we setup the standard 0 = east/+x system
Then swap x and y so 0 radians is up/+y
"""
def getAngle(x1, y1, x2, y2):
    dy = x2 - x1;
    dx = y2 - y1;
    angle = math.degrees(math.atan2(dy,dx));
    #/ math.pi * 180 is how you might otherwise do degrees things;
    #math.degrees(x) for degrees, currently is in radians
    return angle;

@app.route('/')
@requires_auth
def welcome():
    return render_template('set_layout.html')

class ReusableForm(Form):
    name = TextField('Goto Location:', validators=[validators.required()])


headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}


@app.route('/command-bot', methods=['GET', 'POST'])
@requires_auth
def render_command():
    form = ReusableForm(request.form)

    print (form.errors)
    if request.method == 'POST':
        name=request.form['name']
        print (name)

        if form.validate():
            global r
            # Save the comment here.
            flash('Bot commanded to go to ' + name)
            global hiawatha
            # str = hiawatha.goto_location(name)
            # if(str != None):
            #     print ("url")
            #     print ("http://10.200.39.155/mailbox/" + str)
            #     r = requests.post('http://10.200.39.155/mailbox/'+ str + '\n',headers=headers)
            #     print ("Status code:")
            #     print (r.status_code)
            # else:
            #     print ("No path")
            directions, last_angle = hiawatha.get_directions(r, name)
            r.cur_location = name
            r.cur_heading = last_angle
            print(directions)
        else:
            flash('All the form fields are required. ')

    return render_template('command.html', form=form)



    # return render_template('command.html')

# @app.route('/commands/goto/', methods=['POST'])
# @requires_auth
# def command_bot():
#     loc = request.get_json()
#     print location
#     # route = findPath(loc, goto)

@app.route('/input/submit/', methods=['POST'])
@requires_auth
def read_points():
    graph = request.get_json()
    print ("This is the graph:")
    global hiawatha
    hiawatha = Map.Map(graph["matrix"], graph["vertices"])
    #  assert app.debug == False
    return "Graph submitted"


@app.route('/output/location', methods=['GET'])
@requires_auth
def get_location():
    global hiawatha
    return hiawatha.get_location()


if __name__ == "__main__":

    #app.run()
    app.run(host= '0.0.0.0')
