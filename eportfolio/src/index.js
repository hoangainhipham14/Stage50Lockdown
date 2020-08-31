import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Moff(props) {
    return (
        <a href="https://www.youtube.com/watch?v=suu4hdD3qd4" target="_blank" rel="noopener noreferrer"><button>Get Moffed</button></a>
    )
}

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicks: 0,
        };
    }

    render() {
        let message;
        if (this.state.clicks >= 69) {
            message = "Nice."
        } else if (this.state.clicks >= 420) {
            message = "Go outside or something holy shit."
        } else {
            message = "";
        }

        return(
            <div className="clicker">
                <h2>Counter</h2>
                <button onClick={() => this.setState({clicks: this.state.clicks + 1})}>Click me!</button>
                <p>Clicks: {this.state.clicks}</p>
                <p>{message}</p>
            </div>
        );
    }
}

ReactDOM.render(
    <div className="demo">
        <h1>Hello world!</h1>
        <Counter />
        <Moff />
    </div>,
    document.getElementById("root")
);