import React, { Component } from 'react';
import $ from 'jquery';
import './Navigation.scss';
import trans from '../../../../app/translations';

class NavigationItem extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			active : document.location.pathname===this.props.content.href
		}
		this.activateParents = this.activateParents.bind(this)
	}

	activateParents(active) {
		this.setState({active});
	}

	render() {
		if(this.props.content.children && this.props.content.children.length>0) {
			return <li className="nav-item dropdown">
				<a className={`nav-link dropdown-toggle pl-4 ${this.state.active?'active':''}`} href={this.props.content.href} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<i className="fa fa-toolbox"></i> {trans(this.props.content.title)} <span className="sr-only">(current)</span></a>
				<ul className="dropdown-menu">
				{this.props.content.children.map((content, key)=><NavigationItem2 activateParents={this.activateParents} key={`${this.props.pkey}-${key}`} pkey={`${this.props.pkey}-${key}`} content={content}/>)}
		      </ul>
			</li>
		}
		else {
			return <li className="nav-item">
				<a className={`nav-link pl-4 ${this.state.active?'active':''}`} href={this.props.content.href}><i className={this.props.content.icon}></i> {trans(this.props.content.title)} <span className="sr-only">(current)</span></a>
			</li>
		}
	}
}
	
class NavigationItem2 extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			active : false
		}
		this.activateParents = this.activateParents.bind(this)
	}

	componentDidMount() {
		$('.dropdown-menu a.dropdown-toggle').on('mouseenter mouseleave', function(e) {
			  if (!$(this).next().hasClass('show')) {
			    $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
			  }
			  var $subMenu = $(this).next(".dropdown-menu");
			  $subMenu.addClass('show');
			  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
			    $('.dropdown-submenu .show').removeClass("show");
			  });
			  return false;
		});
		this.props.activateParents(document.location.pathname===this.props.content.href);
	}

	activateParents(active) {
		this.setState({active});
	}
	
	render() {
		if(this.props.content.children && this.props.content.children.length>0) {
			return <li className="dropdown-submenu">
				<a className={`dropdown-item dropdown-toggle pl-4 ${this.state.active?'active':''}`} href="#"><i className={this.props.content.icon}></i> {trans(this.props.content.title)}</a>
				<ul className="dropdown-menu">
					{this.props.content.children.map((content, key)=><NavigationItem2 key={`${this.props.pkey}-${key}`} content={content} activateParents={this.activateParents}/>)}
				</ul>
			</li>
		}
		else {
			return <li><a className={`dropdown-item pl-4 ${this.state.active?'active':''}`} href={this.props.content.href}><i className={this.props.content.icon}></i> {trans(this.props.content.title)}</a></li>
		}
	}
}

class Navigation extends Component
{
	render() {
		return <React.Fragment>
	        {(this.props.data || []).map((content, key) => <NavigationItem content={content} key={`liste${key}`} pkey={`liste${key}`}/>)}
	    </React.Fragment>
	}
}

export default Navigation;
