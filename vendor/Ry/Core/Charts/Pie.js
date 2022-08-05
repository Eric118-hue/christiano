import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';

class Pie extends Component
{
    componentDidMount() {
        const layout = {
            width: 150,
            height: 150,
            gutter : 10,
            margin: {
                top : 0,
                right : 20,
                bottom : 0,
                left : 20
            }
        }

        var data = this.props.data.data.filter(it=>it.quantity>0)

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
            .attr('viewBox', `0 0 ${layout.width+layout.margin.left+layout.margin.right} ${layout.height}`)
            .attr('width', layout.width+layout.margin.left+layout.margin.right)
            .attr('height', layout.height)
        
        var arc = d3.arc()
        .outerRadius(layout.width/2)
        .innerRadius(layout.width/2-layout.width/5)

        var container = svg.append("g")
        .attr("transform", `translate(${layout.width/2+layout.margin.left}, ${layout.height/2+layout.margin.top})`)

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
                div.html(data[i].title+": "+format(100*data[i].quantity/sum)+"%")
                div.style("left", (d3.event.pageX - 10 - $('#chart-tooltip').width()/2) + "px")		
                    .style("top", (d3.event.pageY - 25 - $('#chart-tooltip').height()) + "px");
                    $('#chart-tooltip').addClass('tooltip-show');	
            }).on("mouseout", function(d) {	
                $('#chart-tooltip').removeClass('tooltip-show');	
            });

        var labelGroup = container.append("g")
        labelGroup.selectAll("text")
            .data(pie)
            .enter()
            .append("text")
            .attr("d", arc)
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
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

        return <div className="bg-white pt-2 h-100 rounded">
			<h6 className="font-14 text-center" style={titleStyle} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>		
            <div className="row m-3">
                <div className="col p-0" style={{marginLeft:20}}>
                    <div ref="pie" className="vis" style={{height:145}}></div>
                </div>
                <div className="p-0">
                    <ul className="list-group font-12">
                        {this.props.data.data.filter(it=>it.quantity>0).map((item, key)=><li key={`pie-${this.props.data.id}-${key}`} className="list-unstyled"><i className={`fa fa-circle text-${item.color.replace(/-\d+/, '')}`}></i> {item.title}</li>)}
                    </ul>
                </div>
            </div>
		</div>
    }
}

export default Pie;
