import React from 'react';
import AdminUser from '../../vendor/Ry/Admin/User';
import AdminList, {User} from '../../vendor/Ry/Admin/User/List';
import trans from '../translations';

class Leg2UserItem extends User
{
    editLink(roles_queries) {
        return <a href={`/edit_agent?id=${this.props.data.id}&${roles_queries.join('&')}`} className="btn btn-primary mb-3 w-100"><strong>{trans('editer')}</strong></a>
    }
}

class List extends AdminList
{
    beforelist() {
        let roles_queries = []
        if(this.props.data.roles) {
            this.props.data.roles.map(role=>{
                roles_queries.push(`roles[]=${role}`)
            })
        }
        return <a className="btn btn-primary" href={`/add_agent?${roles_queries.join('&')}`}>
            {this.props.data.add_role} <i className="fa fa-plus"></i>
        </a>  
    }

    item(user, key) {
        return <Leg2UserItem key={`list-user-${key}`} data={user} store={this.props.store} remove={(callbacks)=>this.remove(key, user.id, callbacks)}/>
    }
}

class Leg2User extends AdminUser
{
    render() {
        if(this.props.data.subview=='form' || this.props.data.subview=='login')
            return super.render()
        return <List data={this.props.data.data} store={this.props.store}/>
    }
}

export default Leg2User;
