import React, { Component } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import $ from 'jquery';
import numeral from 'numeral';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';

class Line extends Component
{
    componentDidMount() {
        const layout = {
            width: 305,
            height: 150,
            gutter : 10,
            margin: {
                top : 10,
                right : 25,
                bottom : 10,
                left : 40
            }
        }

        var data = this.props.data.data[this.props.data.data.length-1].orders

        let xIsScalar = true
        var ar = []
        for(var i=0; i<data.length; i++) {
            if(typeof(data[i].month)==='string')
                xIsScalar = false
            ar.push(data[i].quantity)
        }
        
        var xScale 
        var dates = []
        if(xIsScalar)
            xScale = d3.scaleLinear().domain([1, 12]).range([0, layout.width-layout.margin.left-layout.margin.right])
        else {
            for(var i=0; i<data.length; i++) {
                dates.push(moment.utc(data[i].month))
            }
            xScale = d3.scaleTime().domain([moment.min(dates).toDate(), moment.max(dates).toDate()]).range([0, layout.width-layout.margin.left-layout.margin.right])
        }  

        var yFormat = function(a){
            return numeral(a).format('0a')
        }
        var yScale = d3.scaleLinear().domain([0,Math.max.apply(null, ar)]).range([layout.height-layout.margin.top, layout.margin.top])
        var yAxis = d3.axisLeft(yScale).tickSize(-(layout.width-layout.margin.left-layout.margin.right)).ticks(5).tickFormat(yFormat)

        var svg = d3.select(this.refs.line).append("svg:svg")
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height);

        const customYAxis = function(g) {
            g.call(yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick line").attr("class", "line-10");
            g.selectAll(".tick text").attr('class', 'text-uppercase');
        }

        var fontSize = 12

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left},${layout.margin.top-5})`)
            .call(customYAxis)
            .attr('font-size', fontSize);

        var line = d3.line()
            .x(function(d){
                if(xIsScalar)
                    return xScale(d.month)
                return xScale(moment.utc(d.month).local().toDate())
            })
            .y(function(d){
                return yScale(d.quantity)
            })
        
        var linecontainer = svg.append("g")
        .attr("transform", `translate(${layout.margin.left},${layout.margin.top-5})`)
        linecontainer.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)

        var points = svg.append("g")
            .attr("transform", `translate(${layout.margin.left},${layout.margin.top-5})`)

        points.selectAll(".dot-10")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot-10")
            .attr("cx", function(d){
                if(xIsScalar)
                    return xScale(d.month)
                return xScale(moment.utc(d.month).local().toDate())
            })
            .attr("cy", function(d){return yScale(d.quantity)})
            .attr("r", 1)
            .on("mouseover", function(d, b, c) { 
                var div = d3.select("#chart-tooltip")
                div.html(numeral(d.quantity).format('0.00$'))
                div.style("left", (d3.event.pageX - 10 - $('#chart-tooltip').width()/2) + "px")		
                    .style("top", (d3.event.pageY - 25 - $('#chart-tooltip').height()) + "px");
                    $('#chart-tooltip').addClass('tooltip-show')
            }).on("mouseout", function(d) {		
                $('#chart-tooltip').removeClass('tooltip-show');	
            });
    }

    render() {
        const titleStyle = {color:"#afaebc"}; 

        return <div className="bg-white pt-2 text-center h-100 rounded">
            <h6 className="font-14 mb-0 text-center" style={titleStyle} dangerouslySetInnerHTML={{__html:this.models('props.data.title')}}></h6>
            <div ref="line" className="vis"></div>
        </div>
    }
}

export default Modelizer(Line);