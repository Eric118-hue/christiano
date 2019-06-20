import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';
import moment from 'moment';

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
        const layout = {
            width: 460,
            height: 166,
            margin: {
                top : 10,
                right : 10,
                bottom : 10,
                left : 40
            }
        }

        var ar = []
        for(var j=0; j<this.props.data.data.length; j++) {
            let data = this.props.data.data[j].orders
            for(var i=0; i<data.length; i++) {
                ar.push(data[i].quantity)
            }
        }

        var mylocale = d3.formatLocale({
            decimal : ',',
            thousand : '&nbsp;',
            currency: ['', '']
        })
        
        const now = new Date();
        const kilera = ["yellow", "orange", 'blue', 'grey']

        var xScale = d3.scaleTime().domain([new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear(), 11, 1)]).range([0, layout.width-layout.margin.left-layout.margin.right])
        var xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(LOCALEFR.format("%b"))

        var yFormat = mylocale.format(".0f")
        var yScale = d3.scaleLinear().domain([0,Math.max.apply(null, ar)]).range([layout.height-layout.margin.top-layout.margin.bottom, layout.margin.top])
        var yAxis = d3.axisLeft(yScale).tickSize(-layout.width+layout.margin.left+layout.margin.right).ticks(5).tickFormat(yFormat)

        var svg = d3.select(this.refs.line).append("svg:svg")
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height);

        var fontSize = 12

        const customYAxis = function(g) {
            g.call(yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick line").attr("class", "line-10");
            g.selectAll(".tick text").attr("x", -10).attr("dy", -4).attr("font-size", fontSize);
        }
        
        const diovy = function(g){
            g.append("g")
                .call(customYAxis);
        };

        const xStyle = function(g){
            g.call(xAxis)
            .select('.domain').remove()
        }

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left},0)`)
            .call(diovy)
            .attr('font-size', fontSize);

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left},${layout.height - layout.margin.top - layout.margin.bottom})`)
            .call(xStyle)
            .attr('font-size', fontSize);

        var area = d3.area()
            .x(function(d) { return xScale(new Date(now.getFullYear(), d.month-1, 1)); })
            .y0(layout.height - layout.margin.top - layout.margin.bottom)
            .y1(function(d) { return yScale(d.quantity); });

        for(let k=0; k<this.props.data.data.length; k++) {
            let data = this.props.data.data[k].orders

            let year = this.props.data.data[k].year

            svg.append("path")
                .data([data])
                .attr("class", `area-${kilera[k%kilera.length]}-6`)
                .attr("transform", `translate(${layout.margin.left},0)`)
                .attr("d", area);

            let points = svg.append("g")
                .attr("transform", `translate(${layout.margin.left},0)`)

            points.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", `dot-${kilera[k%kilera.length]}-10`)
                .attr("cx", function(d){return xScale(new Date(now.getFullYear(), d.month-1, 1))})
                .attr("cy", function(d){return yScale(d.quantity)})
                .attr("r", 3)
                .on("mouseover", function(d, b, c) { 
                    let div = d3.select("#chart-tooltip")	
                    div.html(function(){
                        return moment(new Date(year, d.month-1, 1)).format('MMM') + ' ' + year + '<br/>' + yFormat(d.quantity)
                    })
                    div.style("left", (d3.event.pageX - 10 - $('#chart-tooltip').width()/2) + "px")		
                        .style("top", (d3.event.pageY - 25 - $('#chart-tooltip').height()) + "px");
                        $('#chart-tooltip').addClass('tooltip-show')
                }).on("mouseout", function(d) {		
                    $('#chart-tooltip').removeClass('tooltip-show');	
                });
        }
    }

    render() {
        return <div className="bg-white pt-2 text-center h-100 rounded">
            <h6 className="font-10 text-center" style={{color:"#afaebc",fontSize:"14px"}} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>
            <div ref="line" className="vis p-2" style={{height:166, marginLeft:40}}></div>
        </div>
    }
}

export default LineLarge;