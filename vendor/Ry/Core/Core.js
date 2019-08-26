import React, { Component } from 'react';
import $ from 'jquery';
import Overlays from '../../bs/Overlays';
import {logo} from '../../../env';
import trans from '../../../app/translations';
import toastr from 'toastr';
import {Img} from './Ry';

export class Toast extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			payload : {
				sender : {
					name : 'Centrale',
					thumb : logo
				},
				message : trans('vous_avez_un_message'),
				updated_at : '2019-01-18'
			}
		}
	}

	componentDidMount() {
		this.props.store.subscribe(()=>{
			const state = this.props.store.getState()
			if(state.type==='toast') {
				this.setState({
					payload : state.payload
				})
				$(this.refs.toast).toast('show')
			}
		})
	}

	render() {
		return <div style={{position: 'fixed', bottom: '30px', right: '30px', zIndex: 2000}}>
			<div ref="toast" className="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="3000">
				<div className="bg-aubergine border-bottom-0 text-white toast-header">
					<Img src={this.state.payload.sender.thumb} broken={logo} className="mr-2 rounded-circle"/>
					<strong className="mr-auto">{this.state.payload.sender.name}</strong>&nbsp;
					<small className="text-muted text-white-50">{this.state.payload.updated_at}</small>
					<button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div className="bg-secondary text-light toast-body">
					{this.state.payload.message}
				</div>
			</div>
		</div>
	}
}

class Core extends Component
{
	componentDidMount() {
		this.props.store.subscribe(()=>{
			const state = this.props.store.getState()
			if(state.type==='toast') {
				toastr.options.closeButton = true;
				toastr.options.positionClass = 'toast-top-right';
				toastr.options.showDuration = 1000;
				toastr['info'](state.payload.message);
			}
		})
	}

	render() {
		return <React.Fragment>
			<Overlays store={this.props.store} dialogData={this.props.dialogData}/>
			<div id="chart-tooltip" className="chartist-tooltip bg-dark text-light p-2"></div>
		</React.Fragment>
	}
}

export default Core;