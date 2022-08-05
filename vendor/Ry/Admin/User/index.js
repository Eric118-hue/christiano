import React, {Component} from 'react';
import Form from './Form';
import List from './List';
import Login from './Login';
import Account from './Account';

class User extends Component
{
    render() {
        if(this.props.data.subview=='form')
            return <Form {...this.props}/>
        if(this.props.data.subview=='login')
            return <div></div>
        return <List data={this.props.data.data} store={this.props.store}/>
    }
}

User.Login = Login
User.Account = Account

export default User;