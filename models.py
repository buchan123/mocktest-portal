from flask_login import UserMixin

class User(UserMixin):
    def __init__(self,email,name,_id):
        self.email = email
        self.name = name
        self.id = _id