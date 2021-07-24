import requests
import os
from flask import Blueprint, config, render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, login_required
from models import User

auth = Blueprint('auth', __name__) 
config = {}
config["BASE_URL"] = os.environ.get('BASE_URL')

@auth.route('/login', methods=['GET', 'POST']) 
def login(): 
    if request.method=='GET': 
        return redirect(url_for('main.index'))
    elif request.method=="POST": 
        email = request.form.get('username')
        password = request.form.get('password')
        remember = True if request.form.get('remember') else False

        payload = {
                    "email": email,
                    "password": password
                }
        
        response = requests.post(config["BASE_URL"]+"/api/auth/login", json=payload)
        
        if response.status_code == 200:
            email = response.json()["email"]
            _id = response.json()['id']
            name = response.json()['name']
            user = User(email,name,_id)

            login_user(user, remember=remember)
            return redirect(url_for('main.home'))
        return render_template("index.html", message = "Wrong Username or Password")
        
@auth.route('/logout') 
@login_required
def logout(): 
    logout_user()
    return redirect(url_for('main.index'))
