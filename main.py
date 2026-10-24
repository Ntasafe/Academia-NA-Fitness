from flask import Flask, send_from_directory

app = Flask(__name__, static_folder=None)


@app.get("/")
def home():
    return send_from_directory(app.root_path, "index.html")


@app.get("/style.css")
def stylesheet():
    return send_from_directory(app.root_path, "style.css")


@app.get("/script.js")
def javascript():
    return send_from_directory(app.root_path, "script.js")


if __name__ == "__main__":
    app.run(debug=True)