# copied from MathcadPy github

# Standard Library Imports
from pathlib import Path

# External library Imports
from MathcadPy import Mathcad

# create an instance of the Mathcad class - this object represents the Mathcad application
mathcad_app = Mathcad()

mathcad_worksheet = mathcad_app.open(Path(r"C:\Users\Amelia\Documents\Calculation-Automation\s_c.mcdx"))


## want to use example on page 28 --> W = 0.7m, L1 = 3.6 --> s_s = 1.04  ---> write inputs, store output, print output

mathcad_worksheet.set_real_input("W", 0.7)
mathcad_worksheet.set_real_input("L", 3.6)

s_c, uints, err = mathcad_worksheet._get_output("s_c")

print(f"s_c is {s_c:.2f}")
# Close the worksheet (optional, you can also save)
mathcad_worksheet.close(save_option="Save")

# Quit Mathcad application
mathcad_app.quit(save_option="Save")



#print(mathcad_worksheet.inputs())

#print(mathcad_worksheet.outputs())

# print the value of the input before we interact with it - for debugging purposes only
#print(f"Old input value: {mathcad_worksheet.get_input('L')}")
#mathcad_worksheet.set_real_input("L", 2)  # change the value in Mathcad programmatically
# print the value of the input after we interact with it - for debugging purposes only
#print(f"New input value: {mathcad_worksheet.get_input('L')}")

#mathcad_worksheet.set_real_input("W", 4)  # change the value in Mathcad programmatically

# fetch the output value now we have changed the inputs
#value, units, error_code = mathcad_worksheet.get_real_output("s_c")
#if error_code == 0:  # Good practice to check for errors when you retreive a value
    #print(value, units)
#else:
    #raise ValueError

#mathcad_worksheet.save_as(Path.cwd() / "simple_example_output.mcdx")
#mathcad_app.quit()