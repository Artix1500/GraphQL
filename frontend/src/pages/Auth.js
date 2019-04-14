import React, { Component } from 'react';

import './Auth.scss';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
    state = {
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    };

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin };
        })
    }

    submitHandler = async (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (email.trim().length === 0 || email.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query{
                    login(
                        email: "${email}",
                        password: "${password}"
                    ){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {
                            email: "${email}"
                            password: "${password}"
                        }){
                            _id
                            email
                        }
                    }
                `
            };
        }

        try {
            const res = await fetch("http://localhost:3024/graphql", {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            const resData = await res.json();
            if (resData.data.login.token) {
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                );
            }
            console.log(resData);
        } catch (error) {
            console.log(error);
        }

    };

    render() {
        return <form className="auth-form" onSubmit={this.submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-Mail</label>
                <input type="email" id="email" ref={this.emailEl}></input>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordEl}></input>
            </div>
            <div className="form-actions">
                <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                <button type="submit">Submit</button>
            </div>
        </form>;
    }
}

export default AuthPage;