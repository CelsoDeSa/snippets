class DisplayMessages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: "",
			messages: []
		};
	}
	// add handleChange() and submitMessage() methods here
	handleChange(value) {
		this.setState({ input: value });
	}

	submitMessage(input) {
		const msg = input;
		this.setState({
			messages: [...this.state.messages, msg],
			input: ""
		});
	}

	render() {
		return (
			<div>
				<h2>Type in a new Message:</h2>
				{/* render an input, button, and ul here */}
				<input
					onChange={(event) => this.handleChange(event.target.value)}
					value={this.state.input}
				/>
				<button onClick={() => this.submitMessage(this.state.input)}>
					button
				</button>
				<ul>
					{this.state.messages.map((msg) => (
						<li>{msg}</li>
					))}
				</ul>
				{/* change code above this line */}
			</div>
		);
	}
}
