import React, { Component } from 'react';
import $ from 'jquery';

class AdminTools extends Component
{
	render() {
		return <React.Fragment>
			{this.props.data.admin.map((item, key)=><a key={`admin-tools-${this.props.name}-id-${key}`} className="btn btn-outline-primary btn-sm" href={item.href} data-content={item.data}><i className={item.icon}></i> {item.title}</a>)}
		</React.Fragment>
	}
}

export default AdminTools;