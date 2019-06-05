import React, { Component } from 'react';
import * as d3 from 'd3';

class Gauge extends Component
{
    componentDidMount() {
        var data = this.props.data.data
		var amounts = []
		for(var i=0; i<data.length; i++) {
			amounts.push(data[i].amount)
		}
		var maxAmount = Math.max.apply(null, amounts)
		if(maxAmount==0)
			maxAmount = 1
        var svg = d3.select(this.refs.powergauge)
            .append('svg:svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 640 280')
            .attr('width', 640)
			.attr('height', 280);

		var arcfond = d3.arc().innerRadius(80)
			.outerRadius(200)
			.startAngle(-Math.PI/2)
			.endAngle(Math.PI/2)

		var lefond = svg.append('g')
				.attr('transform', "translate(320, 260)")
				
		lefond
			.append('path')
			.attr("class", "fill-light-0")
			.attr('d', arcfond);
		
        var arcs = svg.append('g')
                .attr('transform', "translate(320, 260)");
        var arc = d3.arc()
        .innerRadius(function(d, i){
			return 80 + i*40
		})
        .outerRadius(function(d, i){
			return 200 + i*40
		})
        .startAngle(function(d, i) {
            return - Math.PI/2
        })
        .endAngle(function(d) {
            return - Math.PI/2 + Math.PI * d.amount/(data.length>1?maxAmount:maxAmount*6);
		});

        arcs.selectAll('path')
			.data(data)
			.enter().append('path')
			.attr('id', function(d, i){
				return `layid${i}`
			})
			.attr("class", function(d, i){
				return "fill-orange-" + i
			})
			.attr('d', arc);
			
		var textWidth = []
		
        var lg = svg.append('g')
            .attr('transform', "translate(320, 360)");
        lg.selectAll('text')
            .data(data)
		.enter().append('text')
		.style("text-align", "right")
		.attr("dy", 40)
		.style("font-size", "34px")
		.append('textPath')
		.attr('xlink:href', function(d, i){
			return `#layid${i}`
		}).text(function(d){
			return d.year
		})
		.each(function(d,i) {
			var thisWidth = this.getComputedTextLength()
			textWidth.push(thisWidth)
			this.remove()
		})
		
		if(data.length>1) {
			var lg2 = svg.append('g')
				.attr('transform', "translate(320, 260)");
			lg2.selectAll('text')
				.data(data)
			.enter().append('text')
			.style("text-align", "right")
			.attr("dy", 40)
			.attr("x", 10)
			.style("font-size", "34px")
			.append('textPath')
			.attr('xlink:href', function(d, i){
				return `#layid${i}`
			}).text(function(d){
				return d.year
			})
		}

		var lineData = [ [15 / 2, 0], 
						[0, -200],
						[-(15 / 2), 0],
						[0, 5],
						[15 / 2, 0] ];
		var pointerLine = d3.line().curve(d3.curveMonotoneX);
		var pg = svg.append('g').data([lineData])
				.attr('class', 'pointer')
				.attr('transform', "translate(320, 260)");
				
		var pointer = pg.append('path')
			.attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
			.attr('transform', 'rotate(-90)')
			.attr('class', 'fill-dark-3');

		pointer.transition()
			.duration(2000)
			.ease(d3.easeElastic.amplitude(1.2))
			.attr('transform', 'rotate('+(data[data.length-1].amount/(data.length>1?maxAmount:maxAmount*6)*180-90)+')');
    }

    render() {
    	const titleStyle = {color:"#afaebc"};
    	const subtitleStyle = {color:"#767676"};

        return <div className="bg-white mt-1 pt-2 text-center h-100 rounded">
			<h6 className="font-14 mb-0 text-center" style={titleStyle} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>
			<span className="alpha-60 font-15" style={subtitleStyle}>{this.props.data.subtitle}</span><br/>
			<div ref="powergauge" className="vis"></div>
			<div className="m-0 ml-3 mr-3 mt-2">
				<h3 className="text-orange font-16 float-left">{this.props.data.label}</h3>
				<span className="font-13 float-right" style={subtitleStyle}><strong>{this.props.data.sublabel}</strong></span>
			</div>
		</div>
    }
}

export default Gauge;