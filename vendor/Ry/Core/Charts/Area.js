import React, { Component } from 'react';
import * as d3 from 'd3';
import {LOCALEFR} from './LineLarge';
import $ from 'jquery';
import numeral from 'numeral';
import moment from 'moment';

class Area extends Component
{
    componentDidMount() {
        const layout = {
            width: 900,
            height: 325,
            margin: {
                top : 20,
                right : 10,
                bottom : 25,
                left : 65
            }
        }

        var ar = []
        for(var m=0; m<this.props.data.data.length; m++) {
            for(var i=0; i<this.props.data.data[m].orders.length; i++) {
                ar.push(this.props.data.data[m].orders[i].quantity)
            }
        }
        
        const now = new Date();

        var xScale = d3.scaleTime().domain([new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear(), 11, 1)]).range([0, layout.width-layout.margin.left-layout.margin.right])
        var xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(LOCALEFR.format("%b"))

        var yFormat = function(a){
            return numeral(a).format('0.0a$')
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
            g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
        }

        const theXaxis = function(g){
            g.call(xAxis);
            g.select(".domain").remove();
        }

        var fontSize = 12

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left},${layout.height - layout.margin.top})`)
            .call(theXaxis)
            .attr('font-size', fontSize);

        var area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(new Date(now.getFullYear(), d.month-1, 1)); })
            .y0(layout.height - layout.margin.top)
            .y1(function(d) { return yScale(d.quantity); });

        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d){
                return xScale(new Date(now.getFullYear(), d.month-1, 1))
            })
            .y(function(d){
                return yScale(d.quantity)
            })

        const kilera = ['info', 'yellow', 'primary', 'info'];
        for(let i=0; i<this.props.data.data.length; i++) {
            let data = this.props.data.data[i].orders
            let year = this.props.data.data[i].year
            let tarea = svg.append("path")
            .data([data])
            .attr("transform", `translate(${layout.margin.left},0)`)
            .attr("d", area)
            tarea.attr("class", `area-${kilera[i%kilera.length]}-6`)

            let points = svg.append("g").attr("transform", `translate(${layout.margin.left},0)`)
            points.selectAll(`.dot-${kilera[i%kilera.length]}`)
            .data(data)
            .enter().append("circle")
            .attr("class", "d-none")
            .attr("id", function(d){
                return `y-${year}-${d.month}`
            })
            .attr("cx", function(d){return xScale(new Date(now.getFullYear(), d.month-1, 1))})
            .attr("cy", function(d){return yScale(d.quantity)})
            .attr("r", 3)

            tarea.on('mousemove', function(){
                points.selectAll('circle').attr('class', 'd-none')
                let month = xScale.invert(d3.mouse(d3.event.currentTarget)[0]).getMonth()
                let date = xScale.invert(d3.mouse(d3.event.currentTarget)[0]).getDate()
                if(date>10)
                    month++;
                month++
                let point = d3.select(`#y-${year}-${month}`)
                if(point) {
                    point.attr('class', `dot-${kilera[i%kilera.length]}-10`)
                    let div = d3.select("#chart-tooltip")
                    if(point.datum()) {
                        div.html(moment(new Date(now.getFullYear(), point.datum().month-1, 1)).format('MMM') + ' ' + year + '<br/>Total : '+ numeral(point.datum().quantity).format('0,0.00$'))
                        div.style("left", ($(`#y-${year}-${month}`).position().left - 5 - $('#chart-tooltip').width()/2) + "px")		
                        .style("top", ($(`#y-${year}-${month}`).position().top - 25 - $('#chart-tooltip').height()) + "px");
                        $('#chart-tooltip').addClass('tooltip-show')
                    }
                }
            }).on("mouseout", function() {		
                $('#chart-tooltip').removeClass('tooltip-show');	
            })

            /*var linecontainer = svg.append("g")
            .attr("transform", `translate(${layout.margin.left},0)`)
            linecontainer.append("path")
                .datum(data)
                .attr("class", "line-10")
                .attr("d", line) */
        }

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left-20},0)`)
            .call(customYAxis)
            .attr('font-size', fontSize);
    }

    render() {
        const titleStyle = {color:"#afaebc"};

        return <div className="bg-white pt-3 text-center h-100 rounded">
            <h6 className="text-center" style={titleStyle} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>
            <div ref="line" className="vis p-2" style={{height:325}}></div>           
        </div>
    }
}

export default Area;