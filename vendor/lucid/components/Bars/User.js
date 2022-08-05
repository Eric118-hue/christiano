import React, {Component} from 'react';
import homme from '../../../../medias/images/profil-homme.jpg';
import femme from '../../../../medias/images/profil-femme.jpg';
import trans from '../../../../app/translations';
import Modelizer from '../../../Ry/Core/Modelizer';

const GENDERMAN = 'mr';

class User extends Component
{	
	render() {
		const pic = (this.props.data.user.profile && this.props.data.user.profile.gender===GENDERMAN) ? homme : femme;
		return <React.Fragment>
			<img src={this.props.data.user.thumb?this.props.data.user.thumb:pic} className="rounded-circle user-photo icon-54"/>
			<div className="dropdown">
				<span>{trans('Bienvenue')},</span>
				{this.models('props.data.usercontextualmenu', []).length>0?<a href="#" className="dropdown-toggle user-name" data-toggle="dropdown"><strong>{this.props.data.user.name}</strong></a>:<a href="#" className="user-name"><strong>{this.props.data.user.name}</strong></a>}
				{this.models('props.data.usercontextualmenu', []).length>0?<ul className="dropdown-menu dropdown-menu-right account">
					{this.props.data.usercontextualmenu.map((menu_item, index)=>menu_item.href?<li key={`usercontextualmenu-${index}`}><a href={menu_item.href}><i className={menu_item.icon}></i>{menu_item.title}</a></li>:<li key={`usercontextualmenu-${index}`} className="divider"></li>)}
				</ul>:null}
			</div>
		</React.Fragment>
	}
}

export default Modelizer(User);