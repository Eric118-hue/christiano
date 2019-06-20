import React, { Component } from 'react';

class OptionItem extends Component
{
	render() {
		if(this.props.item.children) {
			return <React.Fragment>
				<option value={this.props.pkey} data-content={`<span style="padding-left: ${30+this.props.level*30}px;">${this.props.item.title}</span>`}>{this.props.item.title}
				</option>
				{this.props.item.children.map((item, key)=><OptionItem item={item} level={this.props.level+1} key={`option-${this.props.pkey}-${key}`} pkey={`option-${this.props.pkey}-${key}`}/>)}
			</React.Fragment>
		}
		
		return <React.Fragment>
			<option value={this.props.pkey} data-content={`<span style="padding-left: ${30+this.props.level*30}px;">${this.props.item.title}</span>`}>{this.props.item.title}
			</option>
		</React.Fragment>
	}
}

class OptionTree extends Component
{
	render() {
		return <React.Fragment>
			<option>--</option>
			{this.props.tree.map((item, key)=><OptionItem item={item} level={0} key={`option-${this.props.name}-${key}`} pkey={`option-${this.props.name}-${key}`}/>)}
		</React.Fragment>
	}
}

export default OptionTree;
