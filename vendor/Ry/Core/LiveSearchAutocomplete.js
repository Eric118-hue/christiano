import React, {Component} from 'react';
import $ from 'jquery';
import trans from 'ryapp/translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import {store} from 'ryvendor/Ry/Core/Ry';

class Autocomplete extends Component {
	constructor(props) {
		super(props)
		this.control_container = React.createRef()
		this.control = React.createRef()
		this.handleChange = this.handleChange.bind(this)
		this.state = {
			selection : this.models('props.value'),
			data : this.models('props.value') ? [this.models('props.value')] : []
		}
	}
	
	handleChange(event) {
	    const id = event.target.value
	    this.setState(state=>{
			state.selection = state.data.find(it=>it.id==id)
			return state
	    }, ()=>{
			if(this.props.onChange) {
				this.props.onChange(this.state.selection)
			}
		})
	 }
	
	componentDidMount() {
		$(this.control.current).selectpicker({
			noneSelectedText: '--',
			container: 'body',
			liveSearch: true,
			showSubtext : this.props.optionSubtext ? true : false,
			noneResultsText: trans('Aucun résultat')
		});
		const control_input = $(this.control_container.current).find('.bs-searchbox input')
		if(this.props.placeholder)
			control_input.attr('placeholder', this.props.placeholder)
		control_input.on('input propertychange', () => {
			if (this.xhr) {
				this.xhr.abort()
			}
			this.xhr = $.ajax({
				url: this.props.endpoint,
				data: {
					q: control_input.val(),
					json: true
				},
				success: response => {
					this.setState(state => {
						state.data = this.cast(response, 'data.data', [])
						state.selection = this.cast(response, 'data.data.0')
						return state
					})
					setTimeout(()=>{
						$(this.control.current).selectpicker('refresh')
						if(this.props.onChange) {
							this.props.onChange(this.state.selection)
						}
						if(response.type) {
							store.dispatch(response)
						}
					}, 0)
				}
			})
		})
	}
	
	render() {
		const option = this.props.optionLabel ? this.props.optionLabel : it=>JSON.stringify(it)
		const attrOption = this.props.optionSubtext ? it=>{
			return {'data-subtext':this.props.optionSubtext(it)}
		} : it=>{}
		const required = this.props.required ? {required:true} : {}
		return <div ref={this.control_container}>
	        <select ref={this.control} className="form-control" name={this.props.name} onChange={this.handleChange} value={this.models('state.selection.id')} {...required}>
	            {this.state.data.map(item=><option key={item.id} value={item.id} {...attrOption(item)}>{option(item)}</option>)}
	        </select>
	    </div>
	}
}

export default Modelizer(Autocomplete);