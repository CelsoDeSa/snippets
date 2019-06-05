## Table of Contents

- [Making React and Redux Dance Together](#Making-React-and-Redux-Dance-Together)

---

## Making React and Redux Dance Together

1.  Install Redux: `npm install ---save redux`

2.  Create a **store** folder (same leverl as components and containers), and a `reducer.js`:

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

6.  Connect the containers's components to manage state. Example: in containers > Counter > Counter.js

    ```javascript
    // 1. import
    import { connect } from "react-redux";

    class Counter extends Component {
        {some code was here}

        render() {
            return (
                <div>
                    // 4. instead of `this.state.counter`, props.ctr refering to `ctr:` in #2 bellow
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

---

---

## Dispatching Actions from within the Component
