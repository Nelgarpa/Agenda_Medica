
export const initialStore = () => ({
  slug: "nelcy",
  contacts: []
});

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_contacts":
      return {
        ...store,
        contacts: Array.isArray(action.payload) ? action.payload : [] 
      };
    default:
      throw Error("Unknown action.");
  }
}