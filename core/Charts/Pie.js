import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';

class Pie extends Component
{
    componentDidMount() {
        const layout = {
            width: 300,
            height: 300,
            gutter : 10,
            margin: {
                top : 0,
                right : 0,
                bottom : 0,
                left : 0
            }
        }

        var data = this.props.data.data

        var pie = d3.pie()(data.map(function(d) {
            return d.quantity; 
        }));

        let sum = 0.;
        data.map(item=>{
            sum+=parseFloat(item.quantity)
        })

        var svg = d3.select(this.refs.pie)
            .append('svg:svg')
            .data([data])
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height)
        
        var arc = d3.arc()
        .outerRadius(layout.width/2)
        .innerRadius(layout.width/2-layout.width/5)

        var container = svg.append("g")
        .attr("transform", `translate(${layout.width/2}, ${layout.height/2})`)

        const format = d3.format(".2f")
        
        container.selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("class", function(d, i){
                return `fill-${data[i].color}`
            })            
            .attr("d", arc)
            .on("mouseover", function(d, i) {
                var div = d3.select("#chart-tooltip")
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html(data[i].title+": "+format(100*data[i].quantity/sum)+"%")
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function(d) {	
                var div = d3.select("#chart-tooltip")	
                div.transition()	
                    .delay(2000)		
                    .duration(500)		
                    .style("opacity", 0);	
            });

        var labelGroup = container.append("g")
        labelGroup.selectAll("text")
            .data(pie)
            .enter()
            .append("text")
            .attr("d", arc)
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("transform", function(d, i){
                var centroids = arc.centroid(d);
                return `translate(${centroids[0]},${centroids[1]})`;
            })
            .text(function(d, i){
                return format(100*d.value/sum)+"%"
            })

    }

    render() {
        const titleStyle = {color:"#afaebc"}; 

        return <div className="bg-white mt-1 pt-2 h-100 rounded">
			<h6 className="font-14 mb-4 text-center" style={titleStyle} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>		
            <div className="row m-3">
                <div className="col-md-60 p-0">
                    <div ref="pie" className="vis"></div>
                </div>
                <div className="col-md-40">
                    <ul className="list-group font-12">
                        {this.props.data.data.map((item, key)=><li key={`pie-${this.props.data.id}-${key}`} className="list-unstyled"><i className={`fa fa-circle text-${item.color.replace(/-\d+/, '')}`}></i> {item.title}</li>)}
                    </ul>
                </div>
            </div>
		</div>
    }
}

export default Pie;
