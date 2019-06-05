import React, { Component } from 'react';
import Gauge from './Gauge';
import Line from './Line';
import Pie from './Pie';
import Bar from './Bar';
import LineLarge from './LineLarge';
import LineBar from './LineBar';
import LineBarMultiple from './LineBarMultiple';
import Area from './Area';

class Chart extends Component
{
    render() {
		switch(this.props.data.type) {
			case 'gauge':
				return <Gauge data={this.props.data}/>
			case 'line':
				return <Line data={this.props.data}/>
			case 'pie':
				return <Pie data={this.props.data}/>
			case 'bar':
				return <Bar data={this.props.data}/>
			case 'linelarge':
				return <LineLarge data={this.props.data}/>
			case 'linebar':
				return <LineBar data={this.props.data}/>
			case 'linebarmultiple':
				return <LineBarMultiple data={this.props.data}/>
			case 'area':
				return <Area data={this.props.data}/>
		}
	}
}

export default Chart;