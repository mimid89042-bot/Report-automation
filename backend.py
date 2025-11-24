import comtypes.client

# Launch Mathcad Prime
mc = comtypes.client.CreateObject("MathcadPrime.Application")
mc.Visible = True  # Optional: see Mathcad open
print("Mathcad launched successfully!")
