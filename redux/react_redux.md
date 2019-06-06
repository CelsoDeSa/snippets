## Table of Contents

- [Making React and Redux Dance Together](#Making-React-and-Redux-Dance-Together)
- [Passing and Retrieving Data with Action](#Passing-and-Retrieving-Data-with-Action)
- [Switch-Case in the Reducer](#Switch-Case-in-the-Reducer)
- [Updating State Immutably](#Updating-State-Immutably)
- [Updating Arrays Immutably](#Updating-Arrays-Immutably)

---

## Making React and Redux Dance Together

1.  Install Redux: `npm install ---save redux`

2.  Create a **store** folder (same level as components and containers), and a `reducer.js`:

    ```javascript
    const initialState = {
    	counter: 0
    };

    const reducer = (state = initialState, action) => {
    	return state;
    };

    export default reducer;
    ```

3.  The redux store should be create when our app starts, so **index.js** is the best place for this:

    ```javascript
    import { createStore } from "redux";
    import reducer from "./store/reducer";

    const store = createStore(reducer);

    ReactDOM.render(<App />, document.getElementById("root"));
    registerServiceWorker();
    ```

4.  To connect React and Redux install `npm install --save react-redux`

5.  Wrap the `<APP />` with `<Provider>` an pass a `store` property to it in `index.js`:

    ```javascript
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

    ```javascript
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

```javascript
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

```javascript
const mapDispatchToProps = (dispatch) => {
	return {
		// the payload is passing Data
		onSubtractCounter: () =>
			dispatch({ type: "SUBTRACT", payload: { value: 15 } })
	};
};
```

in `reducer.js`

```javascript
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

```javascript
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

   ```javascript
   case "INCREMENT":
       const newState = Object.assign({}, state);
       newState.counter = state.counter + 1;
       return newState;
   ```

2. Using the spread operator `...`

   ```javascript
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

   ```javascript
   case "STORE_RESULT":
       return { ...state, results: state.results.concat({ id: new Date(), value: state.counter }) };
   ```

   accessing `results` in `Counter.js`:

   ```javascript
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
