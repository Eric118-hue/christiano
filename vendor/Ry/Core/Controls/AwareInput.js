import React, { Component } from 'react';
import trans from '../../../../app/translations';
import $ from 'jquery';

class AwareInput extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			value : this.props.value,
			changed : false,
			initialValue : this.props.value
		};
		this.update = this.update.bind(this);
		this.save = this.save.bind(this);
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.props.value!==prevProps.value) {
			this.setState({value:this.props.value});
		}
	}
	
	update(event) {
		this.setState({value: event.target.value, changed:event.target.value!==this.state.initialValue});
	}
	
	save(event) {
		const dis = this;
		$.ajax({
			url : trans('/translations'),
			type : 'post',
			data : {
				lang : this.props.language,
				translation_string : this.state.value,
				translation_id : this.props.translation_id
			},
			success : function(){
				dis.setState({changed: false, initialValue: dis.state.value});
			}
		});
	}
	
	render() {
		return <div className="form-group form-inline">
			<label><span className={`mr-3 flag-icon flag-icon-${this.props.language==='en'?'gb':this.props.language}`}></span></label>
			<input type="text" className="form-control flex-fill" value={this.state.value} onChange={this.update}/>
			<button className={`btn btn-sm ${this.state.changed?'visible':'invisible'}`} onClick={this.save}><i className="fa fa-save fa-2x faa-flash animated"></i></button>
		</div>
	}
}

export default AwareInput;