# Creation Lifecycle

## constructor(props)
- Call super(props)
- **Do:** Set a initial state
- **Don't:** Cause side-effects 
(send a http request, store something in your local storage of the browser, send some analytics to Google Analytics or set timeouts)

## static getDerivedStateFromProps(props, state)
### _Not often used_
Whenever your props change for your class-based component, you can sink your state to them (that will actually be very rare niche cases)
- **Do:** Sync state
- **Don't:** Cause side-effects

## render()
Use it only to prepare the data as you need it to lay out JSX code 
- Prepare & structure your JSX code

### _Render Child Components_
Only once all child components were rendered and their lifecycle hooks finished your lifecycle here will finish

## componentDidMount()
### _Very important and used a lot_
- **Do:** Cause side-effects
(Make HTTP request to get new data from the web)
- **Don't:** Update State 
(this triggers re-render. Exception: it's inside the _then_ block of a promise after you sent a HTTP request, but don't call set state in here synchronously)

Is also the best place to attach any event listeners you need to add for specific functionality.

```
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress)
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress)
  }
```

----

# Update Lifecycle (for props changes)

## static getDerivedStateFromProps(props, state)
### _Not often used_
- **Do:** Sync state to props
- **Don't:** Cause side-effects

You would use it to initialize the state of a component that updates based on props you're getting (update props you're getting most likely). Rarely used because there is a more elegant way of updating your state or managing your components based on external properties.

example of use:

- form control which gets external properties and then you internally want to handle user input but initialize your state or update your state based on outside changes.

## shouldComponentUpdate(nextProps, nextState)
### _Allows to cancel the updating process_
- Has to return ```true``` or ```false```
- Used for performance improvements
- **Do:** Decide whether to continue or not
- **Don't:** Cause side-effects

Decide whether or not React should continue evaluating and re-rendering the component. (For performance optimization and should be used carefully: you can break your components).

This method is a useful way to optimize performance. For example, the default behavior is that your component re-renders when it receives new props, even if the props haven't changed. You can use shouldComponentUpdate() to prevent this by comparing the props. The method must return a boolean value that tells React whether or not to update the component. You can compare the current props (this.props) to the next props (nextProps) to determine if you need to update or not, and return true or false accordingly.

```
class OnlyEvens extends React.Component {
  constructor(props) {
    super(props);
  }

// important code below this line

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Should I update?');
    // only updates if the number is even
    function isEven(num) { return num % 2;}
    return isEven(nextProps.value) == 0 ? true : false;
     
  }

// important code above this line

  componentWillReceiveProps(nextProps) {
    console.log('Receiving new props...');
  }
  componentDidUpdate() {
    console.log('Component re-rendered.');
  }
  render() {
    return <h1>{this.props.value}</h1>
  }
};

class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.addValue = this.addValue.bind(this);
  }
  addValue() {
    this.setState({
      value: this.state.value + 1
    });
  }
  render() {
    return (
      <div>
        <button onClick={this.addValue}>Add</button>
        <OnlyEvens value={this.state.value}/>
      </div>
    );
  }
};
```

## render()
- Prepare & structure your JSX code

Basically the same as the render() in Creation Lifecycle.

### _ Update Child Component Props_
And if they receive new props or state they will iterate their own lifecycle hooks

## getSnapshotBeforeUpdate(prevProps, prevState)
### _Not often used_
- Returns a snapshot value or ```null```
- This value will be used in **componentDidUpdate()** once the DOM has re-rendered
- **Do:** Last-minute DOM ops
- **Don't:** Cause side-effects

Returns a snapshot object which can freely configure.

example of use:

Last minute DOM operations - **not changes** - but scrolling position of the user. Imagine that your upcoming update of the component will re-render the DOM and will add new elements on the DOM and you want to restore the scrolling position of the user once the updating is done.

## componentDidUpdate(prevProps, prevState, snapshot)
### _By far the most often used_
- **Do:** Cause side-effects
(Make HTTP request to get new data from the web, but _you'll have to watch out to not enter an infinite loop_ - a typical problem you'll be facing)
- **Don't:** Update State 
(this triggers re-render. Exception: it's inside the _then_ block of a promise after you sent a HTTP request, but don't call set state in here synchronously)

Signals that you are now done with the updating, that the render method has been executed and now can cause side effects.

----

# Update Lifecycle (for state changes)

For internal changes

## shouldComponentUpdate(nextProps, nextState)
### _Allows to cancel the updating process_
- Same as before but different context

## componentDidUpdate(prevProps, prevState, snapshot)
### _By far the most often used_
- Same as before but different context

----

## componentWillUnmount()
- used for clean up

Removing event listeners is an example of one such clean up action.

```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // important code below this line
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress)
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress)
  }
  // important code above this line

  handleEnter() {
    this.setState({
      message: this.state.message + 'You pressed the enter key! '
    });
  }
  handleKeyPress(event) {
    if (event.keyCode === 13) {
      this.handleEnter();
    }
  }
  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
};
```