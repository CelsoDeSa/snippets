## Table of Contents

- [Multi page feeling in a Single Page App](#Multi-page-feeling-in-a-Single-Page-App)
- [Using Routing Related Props](#Using-Routing-Related-Props)
- [Extra Info](#Extra-Info)
- [Nested Routes](#Nested-Routes)
- [Redirection Requests](#Redirection-Requests)
- [Routing & The Server](#Routing-&-The-Server)

----

# Multi page feeling in a Single Page App

## Step 1: Install Package

`npm install --save react-router react-router-dom`

* It's not dev by Facebook but it's standard

* react-router vs react-router-dom (Section 11, Lecture 215)

We installed both react-router  and react-router-dom . **Technically, only react-router-dom  is required for web development.** It wraps react-router  and therefore uses it as a dependency. 

We **don't need to install** `react-router` on our own for it to work. You can omit this installation step, I left it in there for historic reasons and because I like to emphasize that the main package is named react-router. If you ever search for assistance, you probably want to search for "react router" - that's the name of the package.

----

## Step 2: Enable Routing

in App.js (or Index.js)

```
import { BrowserRouter } from 'react-router-dom';

...
  render() {
    return (
      <BrowserRouter>
        // Wrapped Component Goes Here
     </BrowserRouter>
    );
  }
...
```

----

## Step 3: Set Routing in the Component Itself

Moved components (NewPost, FullPost and Posts) to the **containers folder** because they're going to be loaded as pages through routing (it turns them into containers).

in Blog.js

```
return (
            <div className="Blog">
                <header>
                    <nav>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/new-post">New Post</a></li>
                        </ul>
                    </nav>
                </header>
                // ROUTING GOES HERE
            </div>
        );
```

----

## Step 4: Setting Up and Rendering Routes

in Blog.js

```
import { Route } from 'react-router-dom';
...
</header>
    {/* exact isn't require, but checks if the path "/" has something after it */}
    <Route path="/" exact render={() => <h1>Home</h1> } />
</div>
...
```

----

## Step 5: Rendering Components in Routes 
### and Switching Between Pages

in Blog.js

```
{/* using component instead of render */}
<Route path="/" exact component={Posts} />

{/* removing exact we can handle cases like: /new-post/1 */}
<Route path="/new-post" component={NewPost} />
```

----

## Step 6: Using Links to Switch Pages
### How to stay inside the app and prevent reloading

in Blog.js also import **Link** and change <a> for <Link>

```
import { Route, Link } from 'react-router-dom';
...

<ul>
    <li><Link to="/">Home</Link></li>
    {/* One pair of curly braces for dynamic content and the other pair because it's a JS object */}
    <li><Link to={{
        pathname: '/new-post',
        hash: '#submit',
        search: '?quick-submit=true'
    }}>New Post</Link></li>
</ul>
```

Now we're not going to loose the app's state through the re-rendering.

----

## Step 7: Passing Route Parameters
### Get dynamic routing parameter

**1: Make the Router aware of the Post**

in Blog.js

```
import FullPost from './FullPost/FullPost';
...
<Route path="/" exact component={Posts} />
<Route path="/new-post" component={NewPost} />
\\ Order matters, :id comes last, so when parsed it doesn't disturb the top ones
<Route path="/:id" exact component={FullPost} />
```

**2: Pass the id as part of the URL**

in Posts.js

```
import { Link } from 'react-router-dom';
....
// Wrap <Post> with the <Link> and add the "to={}" parameter and
// key must be passed to the outmost element
<Link to={'/' + post.id} key={post.id}>
    <Post                             
        title={post.title} 
        author={post.author}
        clicked={() => this.postSelectedHandler(post.id)} />
</Link>);
```

**3: Extract the route parameters**

in FullPost.js

```
// before: componentDidUpdate()
    componentDidMount() {
        if (this.props.match.params.id) {
        ...
            axios.get('/posts/' + this.props.match.params.id)
            ...
```

added match.params to id.

This code is only possible because of

```
<Route path="/:id" exact component={FullPost} />
```
in Blog.js (see #1 of Step 7)

----

## Parsing Query Parameters & the Fragment

[Click Here](https://docs.google.com/document/d/1EOwR9k4_mk_U7yiCm-u6mhKmm0YkSyF6F8iF6KXO3jY/edit?usp=sharing)

----

## Step 8: Using Switch to Load a Single Route
### ensure that only one route gets loaded

and prevent all routes which match the path from being rendered

**Method 1 (The easy way)**

in Blog.js add "/posts/" to path

```
<Route path="/postst/:id" exact component={FullPost} />
```

in Posts.js add /posts/ in Link to

```
...
    <Link to={'/posts/' + post.id} key={post.id}>
    ...
```

**Method 2 (Wrapping the Route config)**

in Blog.js add Switch in import and wrap the Routes with it.

```
import { Route, NavLink, Switch } from 'react-router-dom';
...
<Switch>
    <Route path="/" exact component={Posts} />
    <Route path="/new-post" component={NewPost} />
    <Route path="/:id" exact component={FullPost} />
</Switch>
```

Obs.: the Route order still matters.

----

# Using Routing Related Props

## Step 1: Check which props are being passed

in Blog.js, inside componentDidMount()

```
console.log(this.props);
```

----

## Step 2: Access and Pass Routing Related Props
### for calling push on the history or getting info about the loaded route

in **Posts.js** pass the props to Post.js

### Method 1 (pass all props)

```
...
return <Post 
    {...this.props}
...
```

### Method 2 (target a specific  props)

```
...
return <Post 
    match={this.props.match}
...
```

### Method 3 (HOC)

```
import { withRouter } from 'react-router-dom';
...
export default withRouter(post);
```

withRouter adds these props to other components, to any component we wrap with it.


In this case since post is included in posts, we get the same props as we receive in posts.

----

# Extra Info

## Absolut to Relative Path

It's an absolute path by default. To turn it into a Relative Path do this:

in Blog.js

```
...
<Link to={{
    pathname: this.props.match.url + '/new-post',
...
```

[Check this link for more info](https://docs.google.com/document/d/1Wbe47hNboaQqc_IQ20zjP0fumA5E9sAPjRA8I-dFclc/edit?usp=sharing)

----

## Styling the Active Route

in Blog.js

```
import { Route, NavLink } from 'react-router-dom';
\\ changed Link for NavLink
...
<NavLink to="/" exact>
\\ added exact so React doesn't style both paths
\\ "exact" is just needed here because all other paths are nested here.
```

in Blog.css

```
.Blog a.active {
    color: #fa923f;
}
```

To set a specific class different from the default "active" class

```
<NavLink
...
    activeClassName="my-active"
```

Adding a class inline

```
<NavLink
...
    activeStyle={{
        color: '#fa923f',
        textDecoration: 'underline'
    }}>
...
```

----

## Navigation Programmatically
## when you want to navigate after something finished
(a HTTP request was sent, for example)

in posts.js

1. Remove <Link> references and import
2. Move the key={post.id} back to <Post>
3. Push a new page onto the stack of pages

```
    postSelectedHandler = (id) => {
        this.props.history.push({pathname: '/' + id});
        // this.props.history.push('/' + id);
    }
```

(The commented part is the alternative way)

----

# Nested Routes

We can use nested routes in whatever component since our main component is wrapped with  ```<BrowserRouter>``` (as in App.js).

Loading a route through Posts.js

1. ```import { Route } from 'react-router-dom';```
2. ```import FullPost from '../FullPost/FullPost';```
3. Wrap ```<Route path="/:id" exact component={FullPost} />``` in a <div> inside ```return()``` as:

```
        return (
            <div>
                <section className="Posts">
                    {posts}
                </section>
                <Route path="/:id" exact component={FullPost} />
            </div>
        );
```

in Blog.js

1. Remove **exact** from ```<Route path="/" exact component={Posts} />```
2. Change order of routes:

```
<Switch>
    <Route path="/new-post" component={NewPost} />
    <Route path="/" component={Posts} />
</Switch>
```

** Rendering every post trough "Posts/:id" **

in Blog.js, add **/posts** to

1. ```<NavLink to="/" ... >```  
2.  ```<Route path="/" component={Posts} />```

in Posts.js, add **/posts/** to

1. ```this.props.history.push({pathname: '/' + id});```
2. ```<Link to={'/' + post.id} key={post.id} >```

----

## Dynamic Nested Routes

Implement componentDidUpdate(), which will be update again

in FullPosts.js

```
componentDidMount() {
        console.log(this.props);
        this.loadData();
    }

    componentDidUpdate() {
        this.loadData();
    }

    loadData() {
        if (this.props.match.params.id) {
            if (!this.state.loadedPost || (this.state.loadedPost && this.state.loadedPost.id !== +this.props.match.params.id)) {
                axios.get('/posts/' + this.props.match.params.id)
                    .then(response => {
                        this.setState({loadedPost: response.data});
                });
            }
        }
    }
```
loadData checks a new loadedPost against a previously loadedPost to check if their id match through ```this.props.match.params.id```. (Obs.: add ```+``` before ```this.props.match.params.id```so the string it yields is converted to integer and the comparison ```!==``` works properly)

```this.props.match.params.id``` must be updated in other parts of the code:

```
    deletePostHandler = () => {
        axios.delete('/posts/' + this.props.match.params.id)
            .then(response => {
                console.log(response);
            });
    }
...
render() {
    ...
        if (this.props.match.params.id) {
            post = <p style={{textAlign: 'center'}}>Loading...!</p>;
        }
        ....
```

We always need to handle changes in componentDidUpdate() if the component is already loaded through routing, because the router will nor unmount the old one and mount the same one again with different data, it will reuse the old one and just adjust the route parameter, so I need to react to this new parameter in componentDidUpdate - **which will be called because the props changed**:

I'll receive a new props with a new match object with a new params object with the new id.

----

# Redirecting Requests
## Redirecting

in Blog.js

1. add **Redirect** to ```import { Route, NavLink, Switch, Redirect } from 'react-router-dom';```
2. inside ```<Switch>``` add ```<Redirect from="/" to="/posts" />```

----

## Conditional Redirects

in NewPost.js

1. ```import { Redirect } from 'react-router-dom';```
2. create a new state ```submitted: false```
3. set it to true once we make the HTTP request, in ```postDataHandler```:

```
axios.post('/posts/', data)
    .then(response => {
        this.setState({submitted: true});
    });
```

With that in the ```render()``` component:

```
render () {
        let redirect = null;
        if (this.state.submitted) {
            redirect = <Redirect to="/posts" />
        }

        return (
            <div className="NewPost">
                {redirect}
                ...
```

Here the redirect only happens if the submitted state is true, so, when we submit a new post we're redirected to /posts

----

## Using the History Prop to Redirect (Replace)
### This method change the page after a operation is finished.

It changes the page without changing the state. 

As redirect replaces the current page on the stack, we can use **push** that leave the last page (new-post in this case) in the stack so if we press back in the browser we go back to that page:

```
axios.post('/posts/', data)
    .then(response => {
        this.props.history.push('/posts');
    });
```

also we can replicate behavior of redirect by using **replace** instead of ```push```:

```
axios.post('/posts/', data)
    .then(response => {
        this.props.history.replace('/posts');
    });
```

----

## Working with (Navigation) Guards

Guard: parts of the site we only want authenticated users to visit.

### Method #1

in Blog.js

1. add state ```auth: false```
2. add a ternary conditional inside switch ```{this.state.auth? <Route path="/new-post" component={NewPost} /> : null}```

### Method #2

in NewPost.js

```
componentDidMount() {
        // if unauth => this.props.history.replace('posts');
    }
```

----

## Handling the 404 Case (Unknown Routes)

Default behavior: render "/" (Create by ```<Redirect from="/" to="/posts" />``` which catch all routes)

However we can change that. In Blog.js within ```<Switch>```

```
{/* <Redirect from="/" to="/posts" /> */}
<Route render={() => <h1>Not found</h1>} />
```

----

## Loading Routes Lazily

**Code splitting (Lazy Loading):** downloading just what you need (make sense in big apps not to load everything to the users browser, and so making the app faster). *You're only loading the component as you need it*.

1. create a ```hoc``` folder
2. inside the ```hoc``` create a file named asyncComponent.js:

```
import React, { Component } from  'react';

const asyncComponent = (importComponent) => {
    return class extends Component {
        state = {
            component: null
        }

        componentDidMount() {
            importComponent()
                .then(cmp => {
                    this.setState({component: cmp.default});
                });
        }
        
        render() {
            const C = this.state.component;

            return C ? <C {...this.props} /> : null;
        }
    }
};

export default asyncComponent;
```

Note: when we import something in a React folder we inform Webpack about this dependency and it will include it in the global bundle. This the opposite of what we want to do: We don't want include it in the bundle, but to load it when needed.

in Blog.js

1. comment out ```import NewPost from './NewPost/NewPost';``` 
2. create a constant like ```const AsyncNewPost```
3. ```import asyncComponent from '../../hoc/asyncComponent';```and execute it
4. Instead of **NewPost** use **AsyncNewPost** as a component in ```{this.state.auth? <Route path="/new-post" component={AsyncNewPost} /> : null}```

```
import asyncComponent from '../../hoc/asyncComponent';
// import NewPost from './NewPost/NewPost';
const AsyncNewPost = asyncComponent(() => {
    // the bellow is the special dynamic import syntax,
    // Whatever comes between the parentheses is only imported 
    // when the function it is embed in is executed.
    // This function only will be executed when AsyncNewPost is rendered to the screen.
    return import('./NewPost/NewPost');
});
...
<Switch>
    {this.state.auth? <Route path="/new-post" component={AsyncNewPost} /> : null}
    ...
```

----

## Lazy Loading with React Suspense (16.6)
### This approach seems much simpler than the above presented

Using the test app ("routing-react-suspense") here, in App.js

### First Use Case

Routing Scenario: The components are wrapped with ```<BrowserRouter>``` and ```<React.Fragment>```

1. add **Suspense** to ```import React, { Component } from 'react';```
2. create a ```const Posts``` that will replace ```import Posts from './containers/Posts';```
3. Modify ```<Route path="/posts" component={Posts} />``` to use ```render={() => <Suspense><Post /></Suspense>}``` instead of ```component```
4. Add a ```fallback``` function to ```<Suspense>```

```
import React, { Component } from 'react';
...
// import Posts from './containers/Posts';
// in the import method we should use default exports (named exeports are not supported)
const Posts = React.lazy(() => import('./containers/Posts'));
...
<Route 
            path="/posts" 
            render={() => (
              <Suspense fallback={<div>Loading...</div>}>
                <Post />
              </Suspense>
            )} />
```

### Second Use Case

Show Posts pages depending on the toggle of a button:

```
const Posts = React.lazy(() => import('./containers/Posts'));

class App extends Component {
  state = { showPosts: false };

  modeHandler = () => {
    this.setState(prevState => {
      return { showPosts: !prevState.showPosts };
    });
  };

  render() {
    return (
      <React.Fragment>
        <button onClick={this.modeHandler}>Toggle Mode</button>
        {this.state.showPosts ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Posts />
          </Suspense>
        ) : (
            <User />
          )}
      </React.Fragment>
```

----

Note: the test app ("routing-react-suspense") has the ```<React.Fragment>``` that works the same way the **hoc** ```<Aux>``` component we build manually.

----

# Routing & The Server

**Problem:** the routes are known by React (since they are written to the pages) but the server is unaware of them.

**Solution:** We have to configure the server in a way that it always forwards requests (even 404s) to the client so it **always returns the index.html page**.

This allows React to take over and parse the request against the routes it knows.

This works if our domain is "example.com/"

----

**If our app should be at "example.com/my-app**

We have to tell React Router about this:

**Set the base path:**

In the place wwe use ```<BrowserRouter>``` set the prop ```basename``` to the link we want to point to, i.e.: ```<BrowserRouter basename="/my-app">```

Also if we are serving our app from a subdirectory, this code in Posts.js will only work if we set a basename in <BrowserRouter>

```
postSelectedHandler = (id) => {   
        this.props.history.push('/posts/' + id);
        // If we are serving our app from a subdirectory
        // This will only work if we set a basename in <BrowserRouter>
    }
```