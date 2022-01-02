import app
from dataclasses import dataclass
@dataclass
class User(app.db.Model):
    id:int 
    username:str
    password:str

    id = app.db.Column(app.db.Integer(), primary_key= True)
    username= app.db.Column(app.db.String(50))
    password= app.db.Column(app.db.String(50))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def __repr__(self):
        return f'{self.id}: {self.username}: {self.password}'

@dataclass
class News(app.db.Model):
    new_id: int
    title: str
    viewed: int
    liked: bool = False
    user_id: int

    new_id = app.db.Column(app.db.Integer(), primary_key= True)
    title = app.db.Column(app.db.String(500))
    viewed= app.db.Column(app.db.Integer())
    liked= app.db.Column(app.db.Boolean(), default = False)
    user_id= app.db.Column(app.db.Integer(), app.db.ForeignKey("user.id"))
