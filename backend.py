# copied from MathcadPy github
from flask import Flask, request, jsonify
# Standard Library Imports
from pathlib import Path

# External library Imports
from MathcadPy import Mathcad


app = Flask(__name__)

# create an instance of the Mathcad class - this object represents the Mathcad application
mathcad_app = Mathcad(visible = False)

#open worksheet from path
mathcad_worksheet = mathcad_app.open(Path(r"C:\Users\Amelia\Documents\Calculation-Automation\s_c.mcdx"))

#define API
@app.route('/calculate-sc', methods = ['POST'])
def calculate_sc():
    data = request.json

    W = float(data['W'])
    L = float(data['L'])

    #set inputs
    mathcad_worksheet.set_real_input("w", W)
    mathcad_worksheet.set_real_input("L", L)

    #recalculate
    mathcad_worksheet.calculate()

    # retrieve output
    s_c_val, units, err = mathcad_worksheet._get_output("s_c")

    return jsonify({
        's_c': s_c_val,
        'units':unis,
        'error':err
    })

if __name__ == '__main__':
    app.run(debug = True)