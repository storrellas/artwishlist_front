import { createStore } from "redux";

export const MODE = { LANDING: 1, SEARCH: 2, DETAIL: 3 }

export const SET_MODE = "SET_MODE";
export const PERFORM_SEARCH = "PERFORM_SEARCH";
export const SHOW_DETAIL = "SHOW_DETAIL";

export function setMode(payload) {
  return { type: SET_MODE, payload }
};

export function showDetail(payload) {
  return { type: SHOW_DETAIL, payload }
};

export function performSearch(payload) {
  return { type: PERFORM_SEARCH, payload }
};

// Reducers
// ---------------------
const initialState = {
  mode: MODE.LANDING,
  searchPattern: '',
  paintingId: -1
};

export function rootReducer(state = initialState, action) {

  if (action.type === SET_MODE) {
    return { ...state, 
            mode: action.payload.mode, 
          };    
  }

  if (action.type === PERFORM_SEARCH) {
    return { 
            ...state, 
            mode: action.payload.mode, 
            searchPattern: action.payload.searchPattern, 
            paintingId: -1
          };    
  }

  if (action.type === SHOW_DETAIL) {
    return { 
            ...state, 
            mode: action.payload.mode, 
            paintingId: action.payload.paintingId, 
            searchPattern: ''
          };    
  }
  return state;
}

export const store = createStore(rootReducer);
export default store