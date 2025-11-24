import comtypes.client
import os

def open_mathcad_file(file_path):
    if not os.path.exists(file_path):
        print(f"File does not exist: {file_path}")
        return None, None

    try:
        mc_app = comtypes.client.CreateObject("MathcadPrime.Application")
        mc_app.Visible = True

        mc_ws = mc_app.Open(file_path)
        if mc_ws is None:
            print("Failed to open worksheet.")
        else:
            print(f"Worksheet opened: {file_path}")

        return mc_app, mc_ws
    except Exception as e:
        print(f"Error launching Mathcad or opening file: {e}")
        return None, None

if __name__ == "__main__":
    file_path = r"C:\Users\Amelia\Documents\Calculation-Automation\s_c.mcdx"
    app, ws = open_mathcad_file(file_path)

    if app:
        input("Press Enter to close Mathcad...")
        # Use 0 = spDiscardChanges (discard all changes when quitting)
        app.Quit(0)
