from wtforms import Form, StringField
from wtforms.validators import DataRequired

class UserForm(Form):
    username= StringField("username", validators= [DataRequired()])
    password= StringField("password", validators= [DataRequired()])
