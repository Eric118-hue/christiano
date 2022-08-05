import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';
import trans from 'ryapp/translations';
import numeral from 'numeral';

class BarMultiple extends Component
{
    componentDidMount() {
        const layout = {
            width: $(this.refs.bar).parent().parent().parent().parent().parent().width(),
            height: 120,
            gutter : 30,
            margin: {
                top : 30,
                right : 30,
                bottom : 5,
                left : 0
            }
        }

        const tooltip = this.props.data.tooltip

        var data = [...this.props.data.data]
        if(data.length>1) {
            data.unshift({
                title : '',
                quantity : 0
            })
            data.push({
                title : '',
                quantity : 0
            })
        }

        var xScale = d3.scaleLinear().domain([1, data.length]).range([0, layout.width - layout.margin.left - layout.margin.right])
        var xAxis = d3.axisBottom(xScale).ticks(data.length+2).tickFormat((d,i) => {
            let a = d - 1
            return (data.length>a && (a in data)) ? data[a].title : ''
        })

        var ar = []
        for(var i=0; i<data.length; i++) {
            ar.push(data[i].quantity)
        }

        var yFormat = function(a){
            return numeral(a).format('0.0a$')
        }
        var yScale = d3.scaleLinear().domain([0, Math.max.apply(null, ar)]).range([layout.height - layout.margin.top - layout.margin.bottom, 0])
        var yAxis = d3.axisLeft(yScale).tickSize(-(layout.width)).ticks(5).tickFormat(yFormat)
        const customYAxis = function(g) {
            g.call(yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick line").attr("class", "line-light-10");
            g.selectAll(".tick text").remove();
        }

        var svg = d3.select(this.refs.bar).append("svg:svg")
            .data([data])
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height);

        svg.append("g")
            .call(customYAxis)
            .attr('font-size', fontSize);
        
        const diovy = function(g){
            g.call(xAxis)
            g.selectAll(".tick line").attr("class", "line-light");
            g.selectAll('.tick text').attr('class', 'text-light')
            g.select('.domain').remove()
        };

        var fontSize = 10

        var lesx = svg.append("g")
            .attr("transform", `translate(${layout.margin.left},${layout.height - layout.margin.top - layout.margin.bottom})`)
            .call(diovy)
            .attr('font-size', fontSize);

        var baries = svg.append("g").attr("transform", `translate(${Math.round(layout.margin.left-xScale(2)/2)},0)`);

        var barres = baries.append("g")
        barres.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('width', function(d){
                let w = xScale(2)-layout.gutter
                return w > 0 ? w : xScale(2);
            })
            .attr('height', function(d){
                return layout.height-layout.margin.top-layout.margin.bottom-yScale(d.quantity)
            })
            .attr("x", function(d, index){
                return xScale(index+1)
            })
            .attr("y", function(d){
                return yScale(d.quantity)
            })
            .attr("transform", `translate(${layout.gutter/2}, 0)`)
            .attr('class', 'fill-light-1')
            .on("mouseover", function(d, i) {
                var div = d3.select("#chart-tooltip")	
                div.html(trans(tooltip, {quantity:numeral(d.quantity).format('0,0.00'), title:d.title}))
                    .style("left", (d3.event.pageX - 10 - $('#chart-tooltip').width()/2) + "px")		
                    .style("top", (d3.event.pageY - 25 - $('#chart-tooltip').height()) + "px");
                    $('#chart-tooltip').addClass('tooltip-show')
            }).on("mouseout", function(d) {
                $('#chart-tooltip').removeClass('tooltip-show');	
            });

        lesx.append("line")
        .attr("class", "line-light-10")
        .attr("x1", -layout.width)
        .attr("y1", 0)
        .attr("x2", layout.width*2)
        .attr("y2", 0)
        .attr("style", "stroke-width: 1")
    }

    render() {
        return <div ref="bar" className="d-flex justify-content-center p-5 vis"></div>
    }
}

export default BarMultiple;