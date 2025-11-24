from flask import Flask, request, jsonify, render_template
import comtypes.client
import os

app = Flask(__name__)

# Launch Mathcad Prime when the server starts
try:
    mc = comtypes.client.CreateObject("MathcadPrime.Application")
    mc.Visible = True  # You can set False if you don't want the Mathcad window
    print("Mathcad launched successfully!")
except Exception as e:
    print("Error launching Mathcad:", e)
    mc = None

# Open your Mathcad worksheet
file_path = r"C:\Users\Amelia\Documents\Calculation-Automation\s_c.mcdx"
if mc and os.path.exists(file_path):
    try:
        ws = mc.Open(file_path)
        print(f"Worksheet opened: {file_path}")
    except Exception as e:
        print("Error opening worksheet:", e)
        ws = None
else:
    ws = None
    print("Worksheet not found or Mathcad not running")

# Serve the HTML page
@app.route("/")
def index():
    return render_template("index.html")

# Endpoint to calculate s_c using Mathcad
@app.route("/calculate-sc", methods=["POST"])
def calculate_sc():
    if ws is None:
        return jsonify({"error": "Mathcad worksheet not available"}), 500

    data = request.json
    W = data.get("W")
    L = data.get("L")

    if W is None or L is None:
        return jsonify({"error": "Missing W or L"}), 400

    try:
        # Assign values to Mathcad variables
        ws.W = W
        ws.L = L

        # Evaluate the s_c function in Mathcad
        sc_value = ws.Evaluate("s_c")  # assumes s_c is defined in your worksheet

        return jsonify({"s_c": sc_value})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Run the Flask server
    app.run(debug=True)
