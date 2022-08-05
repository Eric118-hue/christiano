import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';

class BarMultiple extends Component
{
    componentDidMount() {
        const layout = {
            width: 640,
            height: 480,
            gutter : 10,
            margin: {
                top : 30,
                right : 30,
                bottom : 30,
                left : 30
            }
        }

        const tooltip = this.props.data.tooltip

        var data = this.props.data.data[0].data

        var xScale = d3.scaleLinear().domain([1, 12]).range([0, layout.width - layout.margin.left - layout.margin.right])
        var xAxis = d3.axisBottom(xScale)

        var ar = []
        for(var i=0; i<data.length; i++) {
            ar.push(data[i].quantity)
        }

        var yScale = d3.scaleLinear().domain([0, Math.max.apply(null, ar)]).range([layout.height - layout.margin.top - layout.margin.bottom, 0])

        var svg = d3.select(this.refs.bar).append("svg:svg")
            .data([data])
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height);
        
        const diovy = function(g){
            g.call(xAxis)
            //g.select('.domain').remove()
        };

        var fontSize = 34

        var lesx = svg.append("g")
            .attr("transform", `translate(${layout.margin.top},${layout.height - layout.margin.top - layout.margin.bottom})`)
            .call(diovy)
            .attr('font-size', fontSize);

        var baries = svg.append("g").attr("transform", `translate(${Math.round(layout.margin.left-xScale(2)/2)},0)`);

        var fond = baries.append("g")
        fond.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('width', xScale(2)-layout.gutter)
            .attr("height", layout.height - layout.margin.top - layout.margin.bottom)
            .attr("x", function(d){
                return xScale(d.month)
            })
            .attr("transform", "translate(5, 0)")
            .attr('class', 'fill-light-1')

        var barres = baries.append("g")
        barres.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('width', function(d){
                return xScale(2)-layout.gutter;
            })
            .attr('height', function(d){
                return layout.height-layout.margin.top-layout.margin.bottom-yScale(d.quantity)
            })
            .attr("x", function(d){
                return xScale(d.month)
            })
            .attr("y", function(d){
                return yScale(d.quantity)
            })
            .attr("transform", "translate(5, 0)")
            .attr('class', 'fill-turquoise-0')
            .on("mouseover", function(d, i) {
                var div = d3.select("#chart-tooltip")	
                div.html(tooltip.replace(':n', d.quantity))
                    .style("left", (d3.event.pageX - 10 - $('#chart-tooltip').width()/2) + "px")		
                    .style("top", (d3.event.pageY - 25 - $('#chart-tooltip').height()) + "px");
                    $('#chart-tooltip').addClass('tooltip-show')
            }).on("mouseout", function(d) {
                $('#chart-tooltip').removeClass('tooltip-show');	
            });

        lesx.append("line")
        .attr("class", "line-primary")
        .attr("x1", -layout.width)
        .attr("y1", 0)
        .attr("x2", layout.width*2)
        .attr("y2", 0)
        .attr("style", "stroke-width: 5")
    }

    render() {
        return <div className="bg-white pt-4 pb-4 text-center h-100 rounded">
            <h5>{this.props.data.title}</h5>
            <div ref="bar" className="vis p-5"></div>
        </div>
    }
}

export default BarMultiple;