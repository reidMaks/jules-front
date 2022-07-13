import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

var cn = require('classnames');

class Question extends React.Component {

    prepare_text(text) {
        let repl = {
            strong: '*',
            mark: '`'
        }
        Object.entries(repl).forEach(entry => {
            const [key, value] = entry;
            text = text.split(value);
            text[1] = `<${key}>${text[1]}</${key}>`;
            text = text.join(' ');
        });

        return { __html: text };
    }


    render() {
        return (

            <p className={cn('question')}
                dangerouslySetInnerHTML={this.prepare_text(this.props.text)}>
            </p>
        );
    }
}

class Answer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var className = cn('btn', 'col-4', {
            'btn-right': this.props.value == this.props.right_option,
            'btn-false': this.props.value != this.props.right_option
        })
        return (
            <button type="button" className={className} onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            question: {},
            q_total: 0,
            q_right: 0
        };
    }

    fetch_question() {
        fetch("http://localhost:5000/question")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        question: result
                    });
                },
                // Примітка: важливо обробляти помилки саме тут,
                // а не в блоці catch (), щоб не перехоплювати
                // виключення з помилок в самих компонентах.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidMount() {
        this.fetch_question()
    }

    handleClick(i) {
        let add = (this.state.question.right_option == i ? 1 : 0)
        this.setState({
            q_total: this.state.q_total + 1,
            q_right: this.state.q_right + add
        });

        this.fetch_question()
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Помилка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Завантаження...</div>;
        } else {
            return (
                <div className="container card-primary" >
                    <div className="container text-center text-info card-header" >
                        <Question text={this.state.question.text} />
                    </div>
                    <div class="container card-body">
                        < div class="btn-group-justified">
                            {this.state.question.options.map((element, i) => <Answer value={element} i={i} right_option={this.state.question.right_option} onClick={() => this.handleClick(element)} />)}
                        </div>
                    </div>
                    <div className="game-info">
                        <div>right: {this.state.q_right}/total:{this.state.q_total}</div>
                        <ol>{/* TODO */}</ol>
                    </div>
                </div>
            )

        }

    }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game name='Makr' />)