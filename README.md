TWP-Calculation/
│
├── index.html             # Main HTML page with form inputs and results container
├── css/
│   └── styles.css         # Styles for layout, columns, and form inputs
└── js/
    ├── main.js            # Entry point: initializes event listeners
    ├── constants.js       # Stores all constants used in calculations such as Nc
    ├── data.js            # Stores input values and results
    ├── dom.js             # Handles DOM manipulation (show/hide elements, update results)
    ├── events.js          # Handles form submission and event listeners
    ├── calculations.js    # Contains calculation functions (s_c, s_gamma, s_p, N_gamma_p, updateCase)
    ├── validation.js      # Input validation logic (e.g., subgrade limits)
    └── results.js         # (Optional) Functions to update/display results in the DOM


index.html needs to be run on a server 
current path (need to automate for user) --->   cd "C:\Users\Amelia\Documents\Calculation-Automation"   
                                                python -m http.server 8000
                                                open http://localhost:8000


DOM manipulation is Document Object Model - a programming interface that represents an HTML or XML document as a tree of objects - the process of accessing, changing or updating the content, structure or style of a web page using JavaScript
Every element like <input> is a "node" in the tree-like HTML document
Javascript can traverse and modify this tree to change the page dynamically
DOM uses document.getElementById(##ID##) to dynamically edit, hide, or show content

In the context of OOP - DOM elements are treated as objects each with there own properties (value, style)
We can wrap DOM manipulation in custom classes to encapsulate behavior