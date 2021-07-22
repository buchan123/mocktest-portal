import requests
from flask import Flask,Blueprint, render_template
from flask_login import login_required, current_user
from flask_login import LoginManager
from auth import auth as auth_blueprint
from models import User

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    return render_template('index.html')

@main_blueprint.route('/home')
@login_required
def home():
    return render_template("home.html", email=current_user.name)

@main_blueprint.route('/tests')
@login_required
def tests():
    return render_template("tests.html", email=current_user.name)


app = Flask(__name__)
app.config['SESSION_TYPE'] = 'memcached'
app.config['SECRET_KEY'] = 't1NP63m4wnBg6nyHYKfmc2TpCOGI4nss'
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)
@login_manager.user_loader
def load_user(user_id):
    try:
        response = requests.get("https://mocktest-api.herokuapp.com/api/user/"+user_id)
        email = response.json()["email"]
        name = response.json()['name']
        return User(email,name,user_id)
    except:
        return None

app.register_blueprint(auth_blueprint)
app.register_blueprint(main_blueprint)
    

if __name__ == "__main__":
    app.run() 
