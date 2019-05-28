## Table of Contents

- [Working with axios](#Working-with-axios)
- [If we want to restrict how many posts to show](#If-we-want-to-restrict-how-many-posts-to-show)
- [Fetching Data on Update](#Fetching-Data-on-Update)
- [POSTing Data to the Server](#POSTing-Data-to-the-Server)
- [Sending a DELETE Request](#Sending-a-DELETE-Request)
- [Handling Errors Locally](#Handling-Errors-Locally)
- [Adding Interceptors to Execute Code Globally](#Adding-Interceptors-to-Execute-Code-Globally)
- [Setting a Default Global Configuration with axios](#Setting-a-Default-Global-Configuration-with-axios)
- [Creating and Using axios Instances](#Creating-and-Using-axios-Instances)

----

## Working with axios
`import axios from 'axios';`

After class

```
state = {
    posts: []
}
```

Before render()

```
componentDidMount() {
    // Storing in a variable won't work, because axios works
    // assynchronously. We need to use Promises, through "then":
    // "then" takes a function as the input and this function
     // will get executed once the promise resolves.
    axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
            this.setState({posts: response.data})
            // console.log(response); checks what we're
            // receiving as "response".                
        });
}
```

Inside render and before return
(we must map here because responde.data is an array)

```
const posts = this.state.posts.map(post => {
    return <Post key={post.id} title={post.title} />
    }
);
```

Inside return

```
<section className="Posts">
    {posts}
</section>
```

----

## If we want to restrict how many posts to show

```
const posts = response.data.slice(0, 4);
    const updatedPosts =posts.map(post => {
        return {
        ...post,
        author: 'Max'
        }
})
this.setState({posts: updatedPosts})
```

----

## Fetching Data on Update 
### (without creating infinite loops)
Inside the **class**

```
// This states helps to manage the assynchronous nature 
// of Ajax requests.
state = {
    loadedPost: null
}
```
inside the method **componentDidUpdate()**

```
if (this.props.id) {
    // To avoid the infinite loop add this check:
    // (We make the request even if we have no loaded post OR if we do
    // have one, but the ids are different)
    if (!this.state.loadedPost || (this.state.loadedPost && this.state.loadedPost.id !== this.props.id)) {
        axios.get('https://jsonplaceholder.typicode.com/posts/' + this.props.id)
            .then(response => {
                // console.log(response);
                this.setState({loadedPost: response.data});
        });
    }
}
```

Inside the **render()** method

```
let post = <p style={{textAlign: 'center'}}>Please select a Post!</p>;
// The line bellow is needed because we first get "props.id" and a 
// little bit later the actual post.
if (this.props.id) {
    post = <p style={{textAlign: 'center'}}>Loading...!</p>;
}
if (this.state.loadedPost) {
    post = (
        <div className="FullPost">
            <h1>{this.state.loadedPost.title}</h1>
            <p>{this.state.loadedPost.body}</p>
            <div className="Edit">
                <button className="Delete">Delete</button>
            </div>
        </div>

    );
}        
return post;
```

----

## POSTing Data to the Server

note: this is a stateful component, **state = {}** should already been initialized.

before **render()**

```
postDataHandler = () => {
    const data = {
        title: this.state.title,
        body: this.state.content,
        author: this.state.author
    };
    // the post() method needs two arguments: the url and the data we
    // want to send (the object in "const data" above)
    axios.post('https://jsonplaceholder.typicode.com/posts/', data)
        // The ".then" here is just to check if we got a 'status: 201' in the
        // which means we were successful.
        .then(response => {
            console.log(response)
        });
}
```

inside **return** there is an **onClick** listener

```
<button onClick={this.postDataHandler}>Add Post</button>
```

----

## Sending a DELETE Request

before **render()**

```
deletePostHandler = () => {
    axios.delete('https://jsonplaceholder.typicode.com/posts/' + this.props.id)
        .then(response => {
            console.log(response);
        });
}
```
inside **render()**

```
<button onClick={this.deletePostHandler} className="Delete">Delete</button>
```

----

## Handling Errors Locally

add **error** to the state:

```
state = {
    posts: [],
    selectedPostId: null,
    error: false
}
```

Add the **catch()** method to **componentDidMount()** after **then()** to handle the asynchronous response

```
componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
            const posts = response.data.slice(0, 4);
            const updatedPosts = posts.map(post => {
                return {
                    ...post,
                    author: 'Max'
                }
            })
            this.setState({posts: updatedPosts})             
        })
        .catch(error => {
            // console.log(error); "catch()" is a method in the Promises arena, like "then()"
            this.setState({error: true})
        });
}
```

Then inside **render()**

```
let posts = <p style={{textAlign: 'center'}}>Something went wrong!</p>

if (!this.state.error) {
    posts = this.state.posts.map(post => {
        return <Post 
            key={post.id} 
            title={post.title} 
            author={post.author}
            clicked={() => this.postSelectedHandler(post.id)} />
    });
}       
```

This will show "Something went wrong!" if axios' get() method fail.

----
## Adding Interceptors to Execute Code Globally

**Interceptors** = functions defined globally which will be executed for every request leaving your app and every response returning into it.

**Useful for:**

- Setting common header (like authorization header)
- Logging responses
- Handling errors globally

Inside index.js (in this case the most high level file where ReactDOM.render() is defined:

```
axios.interceptors.request.use(request => {
    console.log(request);
    // "request" must be returned, otherwise we block it
    return request;
}, error => {
    console.log(error);
    // The line bellow allows to catch errors locally in the compoent
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    console.log(response);
    // "response" must be returned, otherwise we block it
    return response;
}, error => {
    console.log(error);
    // The line bellow allows to catch errors locally in the component
    return Promise.reject(error);
});
```

**Removing Interceptors **
(Section 9, Lecture 163)

You learned how to add an interceptor, getting rid of one is also easy. Simply store the reference to the interceptor in a variable and call eject  with that reference as an argument, to remove it (more info: https://github.com/axios/axios#interceptors):

```
var myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

----

## Setting a Default Global Configuration with axios

Using axios for global configuration, i.e.: a url that will be needed everywhere (in this app 'https://jsonplaceholder.typicode.com')

```
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
```

Setting common headers (which are general header which are set for all types of request, like authorization)

```
axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';
```

The above is just an example, it's React default.

----

## Creating and Using axios Instances

This allows the app to be flexible, each part can be configured individually.

create an **axios.js** file in the **src** folder

```
import axios from 'axios';
```

The create() method makes a copy of the axios object

```
const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
});
```

We can overwrite the following for all the requests sent using this instance

```
instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

export default instance;
```

Then at another post, say blog.js import the instance configuration

```
import axios from '../../axios';
```

----