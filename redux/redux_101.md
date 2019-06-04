Based on the freeCodeCamp course

Redux is a state management framework.

Key principles summary:

- The Redux store is the single source of truth when it comes to application state.
- The state is read-only.
- Create a reducer for each piece of application state when they are distinct or unique in some way.

## Table of Contents

- [Installing Redux](#Installing-Redux)
- [Basic File Structure](#Basic-File-Structure)
- [Create a Redux Store](#Create-a-Redux-Store)
- [Get State from the Redux Store](#Get-State-from-the-Redux-Store)
- [Define a Redux Action](#Define-a-Redux-Action)
- [Define an Action Creator](#Define-an-Action-Creator)
- [Dispatch an Action Event](#Dispatch-an-Action-Event)
- [Handle an Action in the Store](#Handle-an-Action-in-the-Store)
- [Use a Switch Statement to Handle Multiple Actions](#Use-a-Switch-Statement-to-Handle-Multiple-Actions)
- [Use const for Action Types](#Use-const-for-Action-Types)
- [Register a Store Listener](#Register-a-Store-Listener)
- [Combine Multiple Reducers](#Combine-Multiple-Reducers)
- [Send Action Data to the Store](#Send-Action-Data-to-the-Store)
- [Use Middleware to Handle Asynchronous Actions](#Use-Middleware-to-Handle-Asynchronous-Actions)
- [(Review) Write a Counter with Redux](#Review-Write-a-Counter-with-Redux)
- [Never Mutate State](#Never-Mutate-State)

---

## Installing Redux

```javascript
npm install ---save redux
```

---

## Basic File Structure

```javascript
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
```

---

## Create a Redux Store

The Redux store is the single source of truth when it comes to application state.

Any time any piece of your app wants to update state, it must do so through the Redux store. The unidirectional data flow makes it easier to track state management in your app.

The Redux store is an object which holds and manages application state. There is a method called createStore() on the Redux object, which you use to create the Redux store.

This method takes a reducer function as a required argument. The reducer takes state as an argument and returns state.

```javascript
const reducer = (state = 5) => {
	return state;
};

// Redux methods are available from a Redux object
// For example: Redux.createStore()
// Define the store here:

const store = Redux.createStore(reducer);
```

---

## Get State from the Redux Store

You can retrieve the current state held in the Redux store object with the getState() method.

```javascript
const store = Redux.createStore((state = 5) => state);

// Retrieving the state from the store, and assigning it to a new variable currentState
let currentState = store.getState();
```

---

## Define a Redux Action

In Redux, all state updates are triggered by dispatching actions.

An action is simply a JavaScript object that contains information about an action event that has occurred.

Sometimes a Redux action also carries some data (For example, the action carries a username after a user logs in).

Actions must carry a type property that specifies the 'type' of action that occurred.

```javascript
const action = {
	type: "LOGIN"
};
```

---

## Define an Action Creator

The next step is sending the action to the Redux store so it can update its state.

Action creators accomplish this:

They are JavaScript functions that returns objects that represent action events.

```javascript
const action = {
	type: "LOGIN"
};

// Define an action creator here:
const actionCreator = (action) => {
	return action;
};
```

---

## Dispatch an Action Event

Calling store.dispatch() and passing the value returned from an action creator sends an action back to the Redux store.

```javascript
const store = Redux.createStore((state = { login: false }) => state);

const loginAction = () => {
	return {
		type: "LOGIN"
	};
};

// Dispatch the action here:
store.dispatch(loginAction());
```

---

## Handle an Action in the Store

After an action is created and dispatched, the Redux store needs to know how to respond to that action. This is the job of a reducer function.

A reducer takes state and action as arguments, and it always returns a new state (This is the only role of the reducer).

Another key principle in Redux is that state is read-only. In other words, the reducer function must always return a new copy of state and never modify state directly.

```javascript
const defaultState = {
	login: false
};

const reducer = (state = defaultState, action) => {
	// Note: the current state and the dispatched action are passed (from elsewhere) to the reducer, so you can access the action's type directly with action.type
	if (action.type == "LOGIN") {
		return { login: true };
	} else {
		return state;
	}
	// changed code above this line
};

const store = Redux.createStore(reducer);

const loginAction = () => {
	return {
		type: "LOGIN"
	};
};
```

---

## Use a Switch Statement to Handle Multiple Actions

You want to have a state representation for when users are logged in and when they are logged out.

You represent this with a single state object with the property `authenticated`.

You also need action creators that create actions corresponding to user login and user logout, along with the action objects themselves.

```javascript
const defaultState = {
	authenticated: false
};

const authReducer = (state = defaultState, action) => {
	// This is a standard pattern in writing Redux reducers. The switch statement should switch over action.type and return the appropriate authentication state.
	switch (action.type) {
		case "LOGIN":
			return { authenticated: true };
			break;
		case "LOGOUT":
			return { authenticated: false };
			break;
		default:
			return state;
	}
	// change code above this line
};

const store = Redux.createStore(authReducer);

const loginUser = () => {
	return {
		type: "LOGIN"
	};
};

const logoutUser = () => {
	return {
		type: "LOGOUT"
	};
};
```

---

## Use const for Action Types

A common practice when working with Redux is to assign action types as read-only constants, then reference these constants wherever they are used.

```javascript
// Note: It's generally a convention to write constants in all uppercase, and this is standard practice in Redux as well.
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
// changed code above this line, in authReducer and in action creators (using these constants)

const defaultState = {
	authenticated: false
};

const authReducer = (state = defaultState, action) => {
	switch (action.type) {
		case LOGIN:
			return {
				authenticated: true
			};

		case LOGOUT:
			return {
				authenticated: false
			};

		default:
			return state;
	}
};

const store = Redux.createStore(authReducer);

const loginUser = () => {
	return {
		type: LOGIN
	};
};

const logoutUser = () => {
	return {
		type: LOGOUT
	};
};
```

---

## Register a Store Listener

store.subscribe() allows you to subscribe listener functions to the store, which are called whenever an action is dispatched against the store.

```javascript
const ADD = "ADD";

const reducer = (state = 0, action) => {
	switch (action.type) {
		case ADD:
			return state + 1;
		default:
			return state;
	}
};

const store = Redux.createStore(reducer);

// global count variable:
let count = 0;

// changed code below this line
const addCount = () => {
	return (count += 1);
};

store.subscribe(addCount);
// the code above this line is called whenever an action is dispatched against the store (it then triggers the callback function addCount() that increments the variable count)

store.dispatch({ type: ADD });
console.log(count); // 1
store.dispatch({ type: ADD });
console.log(count); // 2
store.dispatch({ type: ADD });
console.log(count); // 3
```

---

## Combine Multiple Reducers

You define multiple reducers to handle different pieces of your application's state, then compose these reducers together into one root reducer. The root reducer is then passed into the Redux createStore() method.

In order to let us combine multiple reducers together, Redux provides the combineReducers() method:

It accepts an object as an argument in which you define properties which associate keys to specific reducer functions. The name you give to the keys will be used by Redux as the name for the associated piece of state (see Note-taking App Example bellow).

It is a good practice to create a reducer for each piece of application state when they are distinct or unique in some way.

### Note-taking App Example

```javascript
const rootReducer = Redux.combineReducers({
	auth: authenticationReducer,
	notes: notesReducer
});
```

In a note-taking app with user authentication, one reducer could handle authentication while another handles the text and notes that the user is submitting.

The key `notes:` will contain all of the state associated with our notes and handled by our `notesReducer`.

In this example, the state held in the Redux store would then be a single object containing `auth` and `notes` properties.

### Challenge: define the root reducer

```javascript
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

const counterReducer = (state = 0, action) => {
	switch (action.type) {
		case INCREMENT:
			return state + 1;
		case DECREMENT:
			return state - 1;
		default:
			return state;
	}
};

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

const authReducer = (state = { authenticated: false }, action) => {
	switch (action.type) {
		case LOGIN:
			return {
				authenticated: true
			};
		case LOGOUT:
			return {
				authenticated: false
			};
		default:
			return state;
	}
};

// defined the root reducer here
const rootReducer = Redux.combineReducers({
	count: counterReducer,
	auth: authReducer
});
// defined above

const store = Redux.createStore(rootReducer);
```

---

## Send Action Data to the Store

This is very common because actions usually originate from some user interaction and tend to carry some data with them. The Redux store often needs to know about this data.

### Challenge

Finish the body of the `addNoteText()` function so that it returns an action object. The object should include a type property with a value of `ADD_NOTE`, and also a `text` property set to the `note` data that's passed into the action creator.

add a case that handles the `addNoteText()` actions. This case should be triggered whenever there is an action of type `ADD_NOTE` and it should return the text property on the incoming `action` as the new `state`.

The action is dispatched at the bottom of the code.

```javascript
const ADD_NOTE = "ADD_NOTE";

const notesReducer = (state = "Initial State", action) => {
	switch (action.type) {
		// 2. The data (note) is recieved and returned bellow
		case ADD_NOTE:
			return action.text;
			break;
		// change code above this line
		default:
			return state;
	}
};

const addNoteText = (note) => {
	// 1. The data (note) is sent in the key `text:` bellow
	const action = {
		type: ADD_NOTE,
		text: note
	};
	return action;
	// change code above this line
};

const store = Redux.createStore(notesReducer);

console.log(store.getState());
// The action (addNoteText()) is dispatched bellow
store.dispatch(addNoteText("Hello!"));
console.log(store.getState());
```

---

## Use Middleware to Handle Asynchronous Actions

Redux provides middleware designed specifically for handling asynchronous actions, called **Redux Thunk middleware**.

To include Redux Thunk middleware (excerpts extracted from the challenge):

1.  pass it as an argument to Redux.applyMiddleware()
2.  This statement is then provided as a second optional parameter to the createStore() function.

    ```javascript
    const store = Redux.createStore(
    	asyncDataReducer,
    	Redux.applyMiddleware(ReduxThunk.default)
    );
    ```

3.  to create an asynchronous action, you return a function in the action creator that takes `dispatch` as an argument (Within this function, you can dispatch actions and perform asynchronous requests).

    ```javascript
    const handleAsync = () => {
    	// you're passing dispatch as a parameter to this special action creator. This is what you'll use to dispatch your actions, you simply pass the action directly to dispatch and the middleware takes care of the rest.
    	return function(dispatch) {
    		// dispatch request action here
    		store.dispatch(requestingData());

    		setTimeout(function() {
    			let data = {
    				users: ["Jeff", "William", "Alice"]
    			};
    			// dispatch received data action here
    			store.dispatch(receivedData(data));
    		}, 2500);
    	};
    };
    ```

**Note:** setTimeout() above is to simulate an API call.

### Challenge

```javascript
const REQUESTING_DATA = "REQUESTING_DATA";
const RECEIVED_DATA = "RECEIVED_DATA";

const requestingData = () => {
	return { type: REQUESTING_DATA };
};
const receivedData = (data) => {
	return { type: RECEIVED_DATA, users: data.users };
};

const handleAsync = () => {
	return function(dispatch) {
		// dispatch request action here
		store.dispatch(requestingData());

		setTimeout(function() {
			let data = {
				users: ["Jeff", "William", "Alice"]
			};
			// dispatch received data action here
			store.dispatch(receivedData(data));
		}, 2500);
	};
};

const defaultState = {
	fetching: false,
	users: []
};

const asyncDataReducer = (state = defaultState, action) => {
	switch (action.type) {
		case REQUESTING_DATA:
			return {
				fetching: true,
				users: []
			};
		case RECEIVED_DATA:
			return {
				fetching: false,
				users: action.users
			};
		default:
			return state;
	}
};

const store = Redux.createStore(
	asyncDataReducer,
	Redux.applyMiddleware(ReduxThunk.default)
);
```

---

## (Review) Write a Counter with Redux

```javascript
const INCREMENT = "INCREMENT"; // define a constant for increment action types
const DECREMENT = "DECREMENT"; // define a constant for decrement action types

const counterReducer = (state = 0, action) => {
	switch (action.type) {
		case INCREMENT:
			return state + 1;
			break;
		case DECREMENT:
			return state - 1;
			break;
		default:
			return state;
	}
}; // define the counter reducer which will increment or decrement the state based on the action it receives

const incAction = () => {
	const action = {
		type: INCREMENT
	};
	return action;
}; // define an action creator for incrementing

const decAction = () => {
	const action = {
		type: DECREMENT
	};
	return action;
}; // define an action creator for decrementing

const store = Redux.createStore(counterReducer); // define the Redux store here, passing in your reducers
```

---

## Never Mutate State
