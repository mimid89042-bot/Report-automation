

// Store user inputs and calculated values
export const inputData = {
    //COHESIVE
    cu: null,
    phi_subgrade: null,
    phi_platform_cohesive: null,
    phi_platform_granular: 35,
    gamma_subgrade: 20,
    gamma_platform_cohesive: null,
    gamma_platform_granular: 40,
    W: null,
    L1: null,
    L2: null,
    q1k: null,
    q2k: null,
    Tallowable: null,
    n: null
};

//any value that is attained (in order of page 28)
export const calculatedData = {
    //COHESIVE
    Ngamma_platform: null,
    Ngamma_subrade: null,
    kptandelta: 5.5,
    sc1: null,
    sc2: null,
    sgamma1: null,
    sgamma2: null,
    sp1: null,
    sp2: null,
    Rd1_subgrade: null,
    Rd2_subgrade: null,
    q1dA: null,
    q2dA: null,
    q1dB: null,
    q2dB: null,
    q1dC: null,
    q2dC: null,
    Rd1_platform: null,
    Rd2_platform: null,
    q1d2: null,
    q2d2: null,
    D1NoGeogrid: null,
    D2NoGeogrid: null,
    DlargerNoGeorgrid: null,
    D1WithGeogrid: null,
    D2WithGeogrid: null,
    D1NoGeogridC: null,
    D2NoGeogridC: null,
    D1largerWithGeorgrid: null,
    D2largerWithGeorgrid: null,
    DlargerWithGeorgrid: null,
    Td: null
};


// Automate input and calculation w data storage (called from events.js)
export function loadInput(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`Element with ID "${id}" not found!`);
        return 0;
    }

    const value = parseFloat(el.value) || 0;
    inputData[id] = value;

    // Update all spans with class `${id}_value`
    updateElementsByClass(`${id}_value`, value, 2);

    return value;
}

// Load calculated value into calculatedData and update corresponding span
export function loadCalculated(key, value) {
    // Store in calculatedData
    calculatedData[key] = value;

    // Update all spans with class `${id}_value`
    updateElementsByClass(`${key}_value`, value, 2);

    return value;
}


// HELPER FUNCTION for loadInput and loadCalculated
export function updateElementsByClass(className, value, decimals = 2) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => {
        if(typeof value === 'number') {
            el.textContent = value.toFixed(decimals);
        } else {
            el.textContent = value;
        }
    });
}
