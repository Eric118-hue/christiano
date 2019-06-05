import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';

export const LOCALEFR = d3.timeFormatLocale({
    "dateTime": "%A, %e %B %Y г. %X",
    "date": "%d.%m.%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    "shortDays": ["lu", "ma", "me", "je", "ve", "sa", "di"],
    months : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
    shortMonths: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
})

class LineLarge extends Component
{
    componentDidMount() {
        var data = this.props.data.data[this.props.data.data.length-1].orders

        const layout = {
            width: 640,
            height: 270,
            margin: {
                top : 25,
                right : 50,
                bottom : 25,
                left : 50
            }
        }

        var ar = []
        for(var i=0; i<data.length; i++) {
            ar.push(data[i].quantity)
        }

        var mylocale = d3.formatLocale({
            decimal : ',',
            thousand : '&nbsp;',
            currency: ['', '']
        })
        
        var xScale = d3.scaleTime().domain([new Date(2019, 0, 1), new Date(2019, 11, 1)]).range([0, layout.width-layout.margin.left-layout.margin.right])
        var xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(LOCALEFR.format("%b"))

        var yFormat = mylocale.format(".0f")
        var yScale = d3.scaleLinear().domain([0,Math.max.apply(null, ar)]).range([layout.height-layout.margin.top, layout.margin.top])
        var yAxis = d3.axisLeft(yScale).tickSize(-layout.width+layout.margin.left+layout.margin.right).ticks(5).tickFormat(yFormat)

        var svg = d3.select(this.refs.line).append("svg:svg")
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height);

        const customYAxis = function(g) {
            g.call(yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick line").attr("class", "line-10");
            g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
            }
        
        const diovy = function(g){
            g.append("g")
                .call(customYAxis);
        };

        var fontSize = 12

        const xStyle = function(g){
            g.call(xAxis)
            .select('.domain').remove()
        }

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left},0)`)
            .call(diovy)
            .attr('font-size', fontSize);

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left},${layout.height - layout.margin.top})`)
            .call(xStyle)
            .attr('font-size', fontSize);

        var area = d3.area()
            .x(function(d) { return xScale(new Date(2019, d.month-1, 1)); })
            .y0(layout.height - layout.margin.top)
            .y1(function(d) { return yScale(d.quantity); });

        svg.append("path")
            .data([data])
            .attr("class", "area-info-9")
            .attr("transform", `translate(${layout.margin.left},0)`)
            .attr("d", area);

        var points = svg.append("g")
            .attr("transform", `translate(${layout.margin.left},0)`)

        points.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot-10")
            .attr("cx", function(d){return xScale(new Date(2019, d.month-1, 1))})
            .attr("cy", function(d){return yScale(d.quantity)})
            .attr("r", 5)
            .on("mouseover", function(d, b, c) { 
                var div = d3.select("#chart-tooltip")
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html(function(){
                    var date = new Date(2019, d.month-1, 1);
                    return yFormat(d.quantity)
                })
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 38) + "px");
            }).on("mouseout", function(d) {		
                var div = d3.select("#chart-tooltip")
                div.transition()	
                    .delay(2000)	
                    .duration(500)		
                    .style("opacity", 0);	
            });
    }

    render() {
        const titleStyle = {color:"#afaebc",fontSize:"14px"};    

        return <div className="bg-white mt-1 pt-2 text-center h-100 rounded">
            <h6 className="font-10 mb-4 text-center" style={titleStyle} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>
            <div ref="line" className="vis"></div>
            <div className="mt-3" dangerouslySetInnerHTML={{__html:this.props.data.subtitle}}></div>
        </div>
    }
}

export default LineLarge;