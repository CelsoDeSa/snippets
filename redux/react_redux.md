## Table of Contents

- [Making React and Redux Dance Together](#Making-React-and-Redux-Dance-Together)
- [Passing and Retrieving Data with Action](#Passing-and-Retrieving-Data-with-Action)
- [Switch-Case in the Reducer](#Switch-Case-in-the-Reducer)
- [Updating State Immutably](#Updating-State-Immutably)
- [Updating Arrays Immutably](#Updating-Arrays-Immutably)
- [Immutable Update Patterns](#Immutable-Update-Patterns)
- [Outsourcing Action Types](#Outsourcing-Action-Types)
- [Combining Multiple Reducers](#Combining-Multiple-Reducers)
- [Understanding State Types](#Understanding-State-Types)
- [Combining Local UI State and Redux](#Combining-Local-UI-State-and-Redux)
- [Useful Resoucers & Links](#Useful-Resoucers-&-Links)

---

## Making React and Redux Dance Together

1.  Install Redux: `npm install ---save redux`

2.  Create a **store** folder (same level as components and containers), and a `reducer.js`:

    ```js
    const initialState = {
    	counter: 0
    };

    const reducer = (state = initialState, action) => {
    	return state;
    };

    export default reducer;
    ```

3.  The redux store should be create when our app starts, so **index.js** is the best place for this:

    ```js
    import { createStore } from "redux";
    import reducer from "./store/reducer";

    const store = createStore(reducer);
    ```

4.  To connect React and Redux install `npm install --save react-redux`

5.  Wrap the `<APP />` with `<Provider>` an pass a `store` property to it in `index.js`:

    ```js
    import { Provider } from "react-redux";

    ReactDOM.render(
    	<Provider store={store}>
    		<App />
    	</Provider>,
    	document.getElementById("root")
    );
    registerServiceWorker();
    ```

    **Note:** `Provider` takes two props, the Redux store and the child components of your app. The Provider component allows you to provide `state` and `dispatch` to your React components, but you must specify exactly what state and actions you want (see next step).

6.  Connect the containers's components to manage state. Example: in containers > Counter > Counter.js

    ```js
    // 1. import
    import { connect } from "react-redux";

    class Counter extends Component {
        {some code was here}

        render() {
            return (
                <div>
                    // 4. instead of `this.state.counter`, `this.props.ctr` refering to `ctr:` in #2 bellow
                    <CounterOutput value={this.props.ctr} />
                </div>
            );
        }
    }

    // 2. after the class
    const mapStateToProps = (state) => {
        return {
            ctr: state.counter // fetched from store > reducer.js
        };
    };

    // 3. kinda wrap, first parenthesis hold some configs and actions like `mapStateToProps`
    export default connect(mapStateToProps)(Counter);
    ```

    **Note 1:** Container components are connected to Redux. These are typically responsible for dispatching actions to the store and often pass store state to child components as props (#4 above).

    **Note 2:** Behind the scenes, React Redux uses the `store.subscribe()` method to implement `mapStateToProps()`.

---

## Dispatching Actions from within the Component

The `mapDispatchToProps()` function is used to provide specific action creators to your React **components** so they can dispatch actions against the Redux store.

It returns an object that maps dispatch actions to property names, each property returns a function that calls dispatch with an action creator and any relevant action data.

in `counter.js`

```js
// 3. Pass it via props
<CounterControl
	label="Increment"
	// clicked={() => this.counterChangedHandler("inc")}
	clicked={this.props.onIncrementCounter}
/>;

// 1. create mapDispatchToProps function
const mapDispatchToProps = (dispatch) => {
	return {
		onIncrementCounter: () => dispatch({ type: "INCREMENT" })
	};
};

// 2. Add it as a second argument to connect
// Note: if you have a container that just dispatch actions, pass null as first argument: export default connect(null, mapDispatchToProps)(Counter);
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Counter);
```

**Note:** You have access to this `dispatch` because it's passed in to `mapDispatchToProps()` as a parameter when you define the function, just like you passed state to `mapStateToProps()`. Behind the scenes, React Redux is using Redux's `store.dispatch()` to conduct these dispatches with `mapDispatchToProps()`.

---

## Passing and Retrieving Data with Action

**Payload:** additional data passed along with the action `type:`.

in `Counter.js`

```js
const mapDispatchToProps = (dispatch) => {
	return {
		// the payload is passing Data
		onSubtractCounter: () =>
			dispatch({ type: "SUBTRACT", payload: { value: 15 } })
	};
};
```

in `reducer.js`

```js
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "SUBTRACT":
			// action.payload.value Retrieves its Data
			return { counter: state.counter - action.payload.value };
		default:
			return state;
	}
};
```

---

## Switch-Case in the Reducer

in `reducer.js`

```js
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "INCREMENT":
			return { counter: state.counter + 1 };
		case "DECREMENT":
			return { counter: state.counter - 1 };
		case "ADD":
			return { counter: state.counter + action.payload.value };
		case "SUBTRACT":
			return { counter: state.counter - action.payload.value };
		default:
			return state;
	}
};
```

---

## Updating State Immutably

in `reducer.js`

1. using `Object.assing()`, which returns a copy of the object

   ```js
   case "INCREMENT":
       const newState = Object.assign({}, state);
       newState.counter = state.counter + 1;
       return newState;
   ```

2. Using the spread operator `...`

   ```js
   switch (action.type) {
   	case "INCREMENT":
   		return { ...state, counter: state.counter + 1 };
   	case "DECREMENT":
   		return { ...state, counter: state.counter - 1 };
   	case "ADD":
   		return { ...state, counter: state.counter + action.payload.value };
   	case "SUBTRACT":
   		return { ...state, counter: state.counter - action.payload.value };
   	default:
   		return state;
   }
   ```

3. Using `concat()` in arrays instead of `push()` (that would change the original array)

   ```js
   case "STORE_RESULT":
       return { ...state, results: state.results.concat({ id: new Date(), value: state.counter }) };
   ```

   accessing `results` in `Counter.js`:

   ```js
   ...
   <ul>
       {this.props.storedResults.map((strResult) => (  // 2. Loop through it
           <li key={strResult.id} onClick={this.props.onDeleteResult}>
               {strResult.value}
           </li>
       ))}
   </ul>
   ...
   const mapStateToProps = (state) => {
       return {
           ctr: state.counter,
           storedResults: state.results // 1. add this
       };
   };
   ```

---

## Updating Arrays Immutably

in `Counter.js`:

1. Turn `this.props.onDeleteResult` in an anonymous function `() => this.props.onDeleteResult()`, which now accepts an argument `(strResult.id)`.

   ```js
   <ul>
   	{this.props.storedResults.map((strResult) => (
   		<li
   			key={strResult.id}
   			// Code bellow is modified
   			onClick={() => this.props.onDeleteResult(strResult.id)}>
   			{strResult.value}
   		</li>
   	))}
   </ul>
   ```

2. Pass the `(strResult.id)` argument to `dispatch` via `(id) =>` bellow and receive it in the `resultElementId: id` payload.

   ```js
   onDeleteResult: (id) =>
   	dispatch({ type: "DELETE_RESULT", resultElementId: id });
   ```

in `reducer.js`:

3. Create a case for the `type:` in the reducer and use `filter()` to create a new array excluding the element id passed via the `resultElementId: id` payload.

   ```js
   case "DELETE_RESULT":
       const updatedArray = state.results.filter(
           (result) => result.id !== action.resultElementId
       );
       return { ...state, results: updatedArray };
   ```

---

## Immutable Update Patterns

Immutable Update Patterns on reduxjs.org: http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html

### Updating Nested Objects

The key to updating nested data is **that _every_ level of nesting must be copied and updated appropriately**. This is often a difficult concept for those learning Redux, and there are some specific problems that frequently occur when trying to update nested objects. These lead to accidental direct mutation, and should be avoided.

### Common Mistake #1: New variables that point to the same objects

Defining a new variable does _not_ create a new actual object - it only creates another reference to the same object. An example of this error would be:

```js
function updateNestedState(state, action) {
	let nestedState = state.nestedState;
	// ERROR: this directly modifies the existing object reference - don't do this!
	nestedState.nestedField = action.data;

	return {
		...state,
		nestedState
	};
}
```

This function does correctly return a shallow copy of the top-level state object, but because the `nestedState` variable was still pointing at the existing object, the state was directly mutated.

### Common Mistake #2: Only making a shallow copy of one level

Another common version of this error looks like this:

```js
function updateNestedState(state, action) {
	// Problem: this only does a shallow copy!
	let newState = { ...state };

	// ERROR: nestedState is still the same object!
	newState.nestedState.nestedField = action.data;

	return newState;
}
```

Doing a shallow copy of the top level is _not_ sufficient - the `nestedState` object should be copied as well.

### Correct Approach: Copying All Levels of Nested Data

Unfortunately, the process of correctly applying immutable updates to deeply nested state can easily become verbose and hard to read. Here's what an example of updating `state.first.second[someId].fourth` might look like:

```js
function updateVeryNestedField(state, action) {
	return {
		...state,
		first: {
			...state.first,
			second: {
				...state.first.second,
				[action.someId]: {
					...state.first.second[action.someId],
					fourth: action.someValue
				}
			}
		}
	};
}
```

Obviously, each layer of nesting makes this harder to read, and gives more chances to make mistakes. This is one of several reasons why you are encouraged to keep your state flattened, and compose reducers as much as possible.

### Inserting and Removing Items in Arrays

Normally, a Javascript array's contents are modified using mutative functions like `push`, `unshift`, and `splice`. Since we don't want to mutate state directly in reducers, those should normally be avoided. Because of that, you might see "insert" or "remove" behavior written like this:

```js
function insertItem(array, action) {
	return [
		...array.slice(0, action.index),
		action.item,
		...array.slice(action.index)
	];
}

function removeItem(array, action) {
	return [...array.slice(0, action.index), ...array.slice(action.index + 1)];
}
```

However, remember that the key is that the _original in-memory reference_ is not modified. **As long as we make a copy first, we can safely mutate the copy**. Note that this is true for both arrays and objects, but nested values still must be updated using the same rules.

This means that we could also write the insert and remove functions like this:

```js
function insertItem(array, action) {
	let newArray = array.slice();
	newArray.splice(action.index, 0, action.item);
	return newArray;
}

function removeItem(array, action) {
	let newArray = array.slice();
	newArray.splice(action.index, 1);
	return newArray;
}
```

The remove function could also be implemented as:

```js
function removeItem(array, action) {
	return array.filter((item, index) => index !== action.index);
}
```

### Updating an Item in an Array

Updating one item in an array can be accomplished by using `Array.map`, returning a new value for the item we want to update, and returning the existing values for all other items:

```js
function updateObjectInArray(array, action) {
	return array.map((item, index) => {
		if (index !== action.index) {
			// This isn't the item we care about - keep it as-is
			return item;
		}

		// Otherwise, this is the one we want - return an updated value
		return {
			...item,
			...action.item
		};
	});
}
```

### Immutable Update Utility Libraries

Because writing immutable update code can become tedious, there are a number of utility libraries that try to abstract out the process. These libraries vary in APIs and usage, but all try to provide a shorter and more succinct way of writing these updates. Some, like [dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable), take string paths for commands:

```js
state = dotProp.set(state, `todos.${index}.complete`, true);
```

Others, like [immutability-helper](https://github.com/kolodny/immutability-helper) (a fork of the now-deprecated React Immutability Helpers addon), use nested values and helper functions:

```js
var collection = [1, 2, { a: [12, 17, 15] }];
var newCollection = update(collection, {
	2: { a: { $splice: [[1, 1, 13, 14]] } }
});
```

They can provide a useful alternative to writing manual immutable update logic.

[Immutable Data#Immutable Update Utilities](https://github.com/markerikson/redux-ecosystem-links/blob/master/immutable-data.md#immutable-update-utilities) section of the [Redux Addons Catalog](https://github.com/markerikson/redux-ecosystem-links).

---

## Outsourcing Action Types

This is an atempt to eliminate the danger of mistyping.

The advantage is that the compiler will point out where is the error in case of a misspelling happens.

1. Create an actions file in `store > actions.js`, then export constants with the same name as the action types you want to perform (goog practice):

   ```js
   export const INCREMENT = "INCREMENT";
   export const DECREMENT = "DECREMENT";
   export const ADD = "ADD";
   export const SUBTRACT = "SUBTRACT";
   export const STORE_RESULT = "STORE_RESULT";
   export const DELETE_RESULT = "DELETE_RESULT";
   ```

2. Import the file and update `reducer.js` switch cases:

   ```js
   import * as actionTypes from "./actions";
   ...
   case actionTypes.INCREMENT:
       ...
   case actionTypes.DECREMENT:
       ...
   case actionTypes.ADD:
       ...
   case actionTypes.SUBTRACT:
       ...
   case actionTypes.STORE_RESULT:
       ...
   case actionTypes.DELETE_RESULT:
       ...
   ```

3. Import and update the containers where the action types are being dispatched, as in `Counter.js`:

   ```js
   import * as actionTypes from "../../store/actions";
   ...
   const mapDispatchToProps = (dispatch) => {
       return {
           onIncrementCounter: () => dispatch({ type: actionTypes.INCREMENT }),
           onDecrementCounter: () => dispatch({ type: actionTypes.DECREMENT }),
           onAddCounter: () => dispatch({ type: actionTypes.ADD }),
           onSubtractCounter: () => dispatch({ type: actionTypes.SUBTRACT }),
           onStoreResult: () => dispatch({ type: actionTypes.STORE_RESULT }),
           onDeleteResult: (id) =>
               dispatch({ type: actionTypes.DELETE_RESULT, resultElementId: id })
       };
   };
   ```

---

## Combining Multiple Reducers

1. Create a new reducers folder: `store > reducers`
2. Create two new files in the reducers folder `counter.js` and `result.js`
3. Split the `reducer.js` logic between them and correct the action types path:

   ```js
   // before: import * as actionTypes from "./actions";
   import * as actionTypes from "../actions";
   ```

4. in `index.js` import `combineReducers` from redux, import the `counterReducer` and `resultReducer` (and delete the import reducer from "./store/reducer"), them create a const `rootReducer` and update the `store`:

   ```js
   // before: import { createStore } from "redux";
   import { createStore, combineReducers } from "redux";

   // deleted: import reducer from "./store/reducer"
   import counterReducer from "./store/reducers/counter";
   import resultReducer from "./store/reducers/result";
   ...
   const rootReducer = combineReducers({
       ctr: counterReducer,
       res: resultReducer
   });
   ...
   // before: const store = createStore(Reducer);
   const store = createStore(rootReducer);
   ```

5. Update the container's `mapStateToProps`, `mapDispatchToProps` and component's functions accordingly. In `containers > Counter > Counter.js`:

   ```js
   // turned `this.props.onStoreResult` into an anonymous function an passing a the counter `ctr`as an argument, that is passed to the `onStoreResult` object function in dispatch bellow
   // before: onClick={this.props.onStoreResult}
   <button onClick={() => this.props.onStoreResult(this.props.ctr)}>
       Store Result
   </button>
   ...
   const mapStateToProps = (state) => {
       return {
           // `ctr` and `res` namespaces defined in `index.js` added here
           ctr: state.ctr.counter, // before: state.counter
           storedResults: state.res.results // before: state.results
       };
   };

   const mapDispatchToProps = (dispatch) => {
       return {
           ...
           // to get the result, onStoreResult now expects a result parameter that will be passed to the swith case in `reducers > result.js`
           // before: onStoreResult: () => dispatch({ type: actionTypes.STORE_RESULT })
           onStoreResult: (result) =>
               dispatch({ type: actionTypes.STORE_RESULT, result: result }),
           ...
       };
   };
   ```

6. Update the `reducers > result.js` switch case to get the action `result` from the container `Counter.js` dispatch:

   ```js
   ...
   case actionTypes.STORE_RESULT:
       return {
           ...state,
           // this had to be changed because the `counter` state is now in a different reducer
           // before: { id: new Date(), value: state.counter }
           results: state.results.concat({ id: new Date(), value: action.result })
       };
   ...
   ```

---

## Understanding State Types

**Types of State**

| Type             | Example                                    | Use Redux?                                        |
| ---------------- | ------------------------------------------ | ------------------------------------------------- |
| Local UI State   | Show / Hide Backdrop                       | Mostly handled within components                  |
| Persistent State | All Users, all Posts, ...                  | Stored on Server, relevant slice managed by Redux |
| Client State     | Is Authenticated? Filters set by User, ... | Managed via Redux                                 |

---

## Combining Local UI State and Redux

Just to handle each keystroke and use two-way binding, we don't necessarily use Redux.

[Check the complete AddPerson app here](/react/react_app_examples/local_ui_state_and_redux_app)

1. Get the child component ready to share state, in `AddPerson.js`:

   ```js
   import React, { Component } from "react";

   import "./AddPerson.css";

   class AddPerson extends Component {
   	// Regular use of state here
   	state = {
   		name: "",
   		age: ""
   	};

   	nameChangedHandler = (event) => {
   		this.setState({ name: event.target.value });
   	};

   	ageChangedHandler = (event) => {
   		this.setState({ age: event.target.value });
   	};

   	render() {
   		return (
   			<div className="AddPerson">
   				<input
   					type="text"
   					placeholder="name"
   					onChange={this.nameChangedHandler}
   					value={this.state.value}
   				/>
   				<input
   					type="number"
   					placeholder="age"
   					onChange={this.ageChangedHandler}
   					value={this.state.age}
   				/>
   				<button
   					// personAdded triggers dispatch in the `Persons.js` container and send this.state.name and this.state.age there as arguments
   					onClick={() =>
   						this.props.personAdded(this.state.name, this.state.age)
   					}>
   					Add Person
   				</button>
   			</div>
   		);
   	}
   }

   export default AddPerson;
   ```

2. In the container add the parameters needed to receive the arguments, in this case and `name` and `age`. In `Persons.js`:

   ```js
   <AddPerson personAdded={this.props.personAddedHandler} />
   ...
   const mapDispatchToProps = (dispatch) => {
       return {
           // it get's `name` and `age` parameters via the personAdded props in the <AddPerson ... /> above, then send them via the `personData` payload bellow to the `reducer.js` matching switch case
           personAddedHandler: (name, age) =>
               dispatch({ type: "ADD_PERSON", personData: { name: name, age: age } }),
           ...
       };
   };
   ```

3. Recieve the state in `reducer.js` switch case:

   ```js
   case "ADD_PERSON":
       const newPerson = {
           id: Math.random(),
           // finally the name and age are receive here and integrated in Redux state
           name: action.personData.name,
           age: action.personData.age
       };
       return { ...state, persons: state.persons.concat(newPerson) };
   ```

---

## Useful Resoucers & Links

- Redux Docs: http://redux.js.org/
- Core Concepts: http://redux.js.org/docs/introduction/CoreConcepts.html
- Actions: http://redux.js.org/docs/basics/Actions.html
- Reducers: http://redux.js.org/docs/basics/Reducers.html
- Redux FAQs: http://redux.js.org/docs/FAQ.html
