import { createStore } from "redux";

export const MODE = { SEARCH: 1, DETAIL: 2 }

export const PERFORM_SEARCH = "PERFORM_SEARCH";
export const SHOW_DETAIL = "SHOW_DETAIL";

export function showDetail(payload) {
  return { type: SHOW_DETAIL, payload }
};


export function performSearch(payload) {
  return { type: PERFORM_SEARCH, payload }
};

// Reducers
// ---------------------
const initialState = {
  mode: MODE.SEARCH,
  searchPattern: '',
  paintingId: 0
};

export function rootReducer(state = initialState, action) {
  if (action.type === PERFORM_SEARCH) {
    return { 
            ...state, 
            mode: action.payload.mode, 
            searchPattern: action.payload.searchPattern, 
            paintingId: 0
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