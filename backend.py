# copied from MathcadPy github
from flask import Flask, request, jsonify
# Standard Library Imports
from pathlib import Path

# External library Imports
from MathcadPy import Mathcad


# create an instance of the Mathcad class - this object represents the Mathcad application
mathcad_app = Mathcad(visible = False)

#open worksheet from path
mathcad_worksheet = mathcad_app.open(Path(r"C:\Users\Amelia\Documents\Calculation-Automation\s_c.mcdx"))



mathcad_worksheet.set_real_input("W", 0.7)
mathcad_worksheet.set_real_input("L", 3.6)

s_c, uints, err = mathcad_worksheet._get_output("s_c")

print(f"s_c is {s_c:.2f}")
# Close the worksheet (optional, you can also save)
mathcad_worksheet.close(save_option="Save")

# Quit Mathcad application
mathcad_app.quit(save_option="Save")

