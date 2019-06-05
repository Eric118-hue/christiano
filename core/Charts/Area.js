import React, { Component } from 'react';
import * as d3 from 'd3';
import {LOCALEFR} from './LineLarge';

class Area extends Component
{
    componentDidMount() {
        const layout = {
            width: 640,
            height: 300,
            margin: {
                top : 20,
                right : 10,
                bottom : 25,
                left : 45
            }
        }

        var ar = []
        for(var m=0; m<this.props.data.data.length; m++) {
            for(var i=0; i<this.props.data.data[m].orders.length; i++) {
                ar.push(this.props.data.data[m].orders[i].quantity)
            }
        }

        var mylocale = d3.formatLocale({
            decimal : ',',
            thousand : '&nbsp;',
            currency: ['', ' €']
        })
        
        var xScale = d3.scaleTime().domain([new Date(2019, 0, 1), new Date(2019, 11, 1)]).range([0, layout.width-layout.margin.left-layout.margin.right])
        var xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(LOCALEFR.format("%b"))

        var yFormat = mylocale.format("$.1s")
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
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(new Date(2019, d.month-1, 1)); })
            .y0(layout.height - layout.margin.top)
            .y1(function(d) { return yScale(d.quantity); });

        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d){
                return xScale(new Date(2019, d.month-1, 1))
            })
            .y(function(d){
                return yScale(d.quantity)
            })

        const kilera = ['area-light-1', 'area-turquoise-8', 'area-info-4'];
        for(var i=0; i<this.props.data.data.length; i++) {
            var data = this.props.data.data[i].orders
            var tarea = svg.append("path")
            .data([data])
            .attr("transform", `translate(${layout.margin.left},0)`)
            .attr("d", area)
            tarea.attr("class", kilera[i%kilera.length])

            var linecontainer = svg.append("g")
            .attr("transform", `translate(${layout.margin.left},0)`)
            linecontainer.append("path")
                .datum(data)
                .attr("class", "line-10")
                .attr("d", line) 
        }

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left},0)`)
            .call(customYAxis)
            .attr('font-size', fontSize);
    }

    render() {
        const titleStyle = {color:"#afaebc"};

        return <div className="bg-white pt-4 pb-4 text-center h-90 rounded">
            <h6 className="text-center" style={titleStyle} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>
            <div ref="line" className="vis p-5"></div>                        
        </div>
    }
}

export default Area;