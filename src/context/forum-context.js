import React, { createContext, Component } from "react";
import decode from "jwt-decode";

export const ForumContext = createContext(null);

class ForumContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };
        const token = localStorage.getItem("forumToken");
        if (token) {
            const decodedToken = decode(token);
            this.state = {
                user: decodedToken.user,
            };
        } else {
            this.state = {
                user: {},
            };
        }
    }

    updateUser = async (user) => {
        this.setState({
            user: user,
        });
    };

    render() {
        return (
            <ForumContext.Provider
                value={{ forumUser: this.state.user, updateUser: this.updateUser }}
            >
                {this.props.children}
            </ForumContext.Provider>
        );
    }
}
export default ForumContextProvider;
