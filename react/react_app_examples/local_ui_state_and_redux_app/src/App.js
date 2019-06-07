import React, { Component } from "react";

import Persons from "./containers/Persons";

class App extends Component {
	render() {
		return (
			<div className="App">
				<h1>This app Combines Local UI State and Redux</h1>
				<Persons />
			</div>
		);
	}
}

export default App;
