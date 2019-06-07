// Node import sintax
const redux = require("redux");
const createStore = redux.createStore;

// default state
const initialState = {
	counter: 0
};

// Reducer
const rootReducer = (state = initialState, action) => {
	if (action.type === "INC_COUNTER") {
		return {
			...state, // copying state (because we can't change the original state)
			counter: state.counter + 1
		};
	}
	if (action.type === "ADD_COUNTER") {
		return {
			...state,
			counter: state.counter + action.value
		};
	}
	return state;
};

// Store
const store = createStore(rootReducer);
console.log(store.getState());

// Subscription (it's a store listener: it informs when changes happen)
store.subscribe(() => {
	console.log("[Subscription]", store.getState()); // This is executed whenever an action is dispatched and mutates the store
});

// Dispatching Action
store.dispatch({ type: "INC_COUNTER" });
store.dispatch({ type: "ADD_COUNTER", value: 10 });
console.log(store.getState());
