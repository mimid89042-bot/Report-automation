import comtypes.client

# Launch Mathcad Prime
mc = comtypes.client.CreateObject("MathcadPrime.Application")
mc.Visible = True  # Optional: see Mathcad open
print("Mathcad launched successfully!")

file_path = r"C:\Users\Amelia\Documents\Calculation-Automation\s_c.mcdx"

ws = mc.Open(file_path)