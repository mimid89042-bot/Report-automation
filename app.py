# app.py
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index1.html")

@app.route("/calculate-sc", methods=["POST"])
def calculate_sc():
    data = request.json
    W = data.get("W")
    L = data.get("L")
    # For testing, just echo back
    return jsonify({"s_c": W + L})

if __name__ == "__main__":
    app.run(debug=True)
