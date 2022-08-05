import React, {Component} from 'react';
import trans from '../../../../app/translations';

class DrawerItem extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			active : false
		};
		this.activateParents = this.activateParents.bind(this)
	}

	activateParents(active) {
		if(active) {
			this.setState({active});
			this.props.activateParents(active);
		}
	}

	componentDidMount() {
		let active = (document.location.pathname===this.props.content.href)
		if(active) {
			this.setState({active})
			this.props.activateParents(active);
		}
	}
	
	render() {
		if(this.props.content.children && this.props.content.children.length>0 && this.props.content.href) {
			return <li className={this.state.active?'active':''}>
				<a href="#" className="has-arrow"><i className={this.props.content.icon}></i> <span>{trans(this.props.content.title)}</span></a>
				<ul>
					{this.props.content.children.map((content, key)=><DrawerItem noIcon={true} activateParents={this.activateParents} content={content} key={`${this.props.pkey}-${key}`} pkey={`${this.props.pkey}-${key}`}/>)}                              
				</ul>
			</li>
		}
		else if(this.props.noIcon && this.props.content.href) {
			return <li className={this.state.active?'active':''}><a href={this.props.content.href}>{trans(this.props.content.title)}</a></li>
		}
		else if(this.props.content.href) {
			return <li className={this.state.active?'active':''}><a href={this.props.content.href}><i className={this.props.content.icon}></i> <span>{trans(this.props.content.title)}</span></a></li>
		}
		return null
	}
}

class Drawer extends Component
{
	render() {
		return <React.Fragment>
			{(this.props.data || []).map((content, key)=><DrawerItem content={content} key={`drawer${key}`} activateParents={()=>null} pkey={`drawer${key}`}/>)}
		</React.Fragment>
	}
}
	
export default Drawer;