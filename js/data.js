// data.js
import { DEFAULT_PHI_P, DEFAULT_GAMMA } from './constants.js';

// Store user inputs and calculated values
export const inputData = {
    cu: null,
    phi_p: DEFAULT_PHI_P,
    gamma: DEFAULT_GAMMA,
    Wd: null,
    L1d: null,
    L2d: null
};

export const resultsData = {
    N_gamma_p: null,
    cases: {
        1: { s_c: null, s_gamma: null, s_p: null },
        2: { s_c: null, s_gamma: null, s_p: null }
    },
    R_d: null,
    q1d: null,
    q2d: null
};
