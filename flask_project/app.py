from flask import Flask, render_template, request, url_for, redirect, json
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from form import UserForm
import requests
app = Flask(__name__)
load_dotenv('./.flaskenv')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db= SQLAlchemy(app)
db.init_app(app)

import model
db.create_all()
loggedUser= model.User.query.filter_by(username = "victor").first()
@app.route("/")
def display_singup_page():
    return render_template("signup.html")


@app.route("/", methods= ["POST"])
def signup_page():
    user_input= request.get_json()
    user_form= UserForm(data = user_input)

    if user_form.validate():
        user = model.User.query.filter_by(username = user_form.username.data).first()
        print(user)
        if user is not None:
            return render_template("signup.html", error= "User exists")
        user = model.User(username = user_form.username.data, password = user_form.password.data)
        print(user)
        db.session.add(user)
        db.session.commit()
        data = {"error": "None"} # Your data in JSON-serializable type
        response = app.response_class(response=json.dumps(data),
                                  status=200,
                                  mimetype='application/json')
        return response
    data = {"error": "Validation Error"}
    response = app.response_class(response= json.dumps(data), status=200, mimetype = "application/json")
    return response

@app.route("/login")
def display_login_page():
    # return "hello world "
    return render_template("login.html")


@app.route("/login",methods = ["POST"])
def login_page():
    user_input = request.get_json()
    user_form = UserForm(data= user_input)
    if user_form.validate():
        user= model.User.query.filter_by(username= user_form.username.data, password= user_form.password.data).first()
        if user is None:
            data = {"error": "User and password don't match"}
            response= app.response_class(response= json.dumps(data),status = 200, mimetype = "application/json")
            return response
        
        data = {"error": "None"}
        
        response = app.response_class(response= json.dumps(data), status = 200, mimetype= "application/json")
        return response
    data = {"error": "Validation Failed"}
    response = app.response_class(response= json.dumps(data), status = 200, mimetype= "application/json")
        
    return response

@app.route("/home")
def display_home():
    return render_template("home.html")

@app.route("/likedNews")
def display_like():
    global loggedUser
    user_id = loggedUser.id
    likedNews= model.User.query.join(model.News, model.User.id== model.News.user_id).add_columns(model.User.id, model.News.title, model.News.liked).filter( model.User.id == user_id).all()
    data = []
    for row in likedNews:
        data.append([x for x in row])
    response= app.response_class(response= json.dumps(data), status =200, mimetype= "application/json")
    return response

@app.route("/like", methods = ["POST"])
def get_like():
    global loggedUser
    user_id = loggedUser.id
    user_input = request.get_json()

    likedNews= model.News.query.filter(model.News.user_id == user_id).filter(model.News.title == user_input['title']).first()
    if likedNews is not None:
        # liked = likedNews[3]
        print(likedNews)
        if likedNews.liked:
            likedNews.liked= False
        else:
            likedNews.liked = True
        db.session.commit()
        data = {"status": "Ok"}
        response = app.response_class(response= json.dumps(data), status = 200, mimetype= "application/json")
        return response
    news = model.News(user_id = user_id, title = user_input['title'], liked = True, viewed= 0)
    db.session.add(news)
    db.session.commit()
    response = app.response_class(response= json.dumps(news), status = 200, mimetype= "application/json")
    return response


    

if __name__ == "__main__":
    app.run()