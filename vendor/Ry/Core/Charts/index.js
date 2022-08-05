import React, { Component } from 'react';
import Gauge from './Gauge';
import Line from './Line';
import Pie from './Pie';
import Bar from './Bar';
import LineLarge from './LineLarge';
import LineBar from './LineBar';
import LineBarMultiple from './LineBarMultiple';
import Area from './Area';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import $ from 'jquery';
import {store} from 'ryvendor/Ry/Core/Ry';

async function loadData(url, data) {
	return new Promise((resolve, reject)=>{
		$.ajax({
			url,
			data,
			success : response=>{
				store.dispatch(response)
				resolve(response)
			},
			error : error=>{
				reject(error)
			}
		})
	})
}

class Chart extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			data : this.props.data
		}
		this.loadAjaxData = this.loadAjaxData.bind(this)
	}

	async loadAjaxData() {
		if(this.models('props.data.endpoint')) {
			await loadData(this.models('props.data.endpoint'), {
				hash : this.hash
			})
		}
	}

	componentDidMount() {
		this.hash = Math.random().toString(36).substring(2)
		store.subscribe(()=>{
			const storeState = store.getState()
			if(storeState.type==this.hash) {
				this.setState({
					data : storeState.data
				})
			}
		})
		this.loadAjaxData()
	}

    render() {
		switch(this.models('props.data.type')) {
			case 'gauge':
				return <Gauge data={this.state.data} className={this.props.className}/>
			case 'pie':
				return <Pie data={this.state.data} className={this.props.className}/>
			case 'bar':
				return <Bar data={this.state.data} className={this.props.className}/>
			case 'linelarge':
				return <LineLarge data={this.state.data} className={this.props.className}/>
			case 'linebar':
				return <LineBar data={this.state.data} className={this.props.className}/>
			case 'linebarmultiple':
				return <LineBarMultiple data={this.state.data} className={this.props.className}/>
			case 'area':
				return <Area data={this.state.data} className={this.props.className}/>
			default:
			case 'line':
					return <Line data={this.state.data} className={this.props.className}/>
		}
	}
}

export default Modelizer(Chart);