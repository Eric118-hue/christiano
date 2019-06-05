import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';

class Bar extends Component
{
    componentDidMount() {
        const layout = {
            width: 640,
            height: 300,
            gutter : 10,
            margin: {
                top : 5,
                right : 30,
                bottom : 25,
                left : 30
            }
        }

        const tooltips = this.props.data.tooltips

        var data = this.props.data.data[0].data

        const months = ['', "Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

        var xScale = d3.scaleLinear().domain([1, 12]).range([0, layout.width - layout.margin.left - layout.margin.right])
        var xAxis = d3.axisBottom(xScale).tickFormat((a)=>months[a])

        var ar = []
        for(var i=0; i<data.length; i++) {
            ar.push(data[i].quantity[0])
            ar.push(data[i].quantity[1])
        }

        var yScale = d3.scaleLinear().domain([0, Math.max.apply(null, ar)]).range([layout.height - layout.margin.top - layout.margin.bottom, 0])

        var svg = d3.select(this.refs.bar).append("svg:svg")
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height);
        
        const diovy = function(g){
            g.call(xAxis)
            g.select('.domain').remove()
        };

        var fontSize = 12

        svg.append("g")
            .attr("transform", `translate(${layout.margin.left},${layout.height-layout.margin.bottom+layout.margin.top})`)
            .call(diovy)
            .attr('font-size', fontSize);

        var barres = svg.append("g")
        .attr("transform", `translate(0, ${layout.margin.top})`)
        barres.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('width', function(d){
                return 20;
            })
            .attr('height', function(d){
                return layout.height-layout.margin.top-layout.margin.bottom-yScale(d.quantity[0])
            })
            .attr("x", function(d){
                return xScale(d.month)+5
            })
            .attr("y", function(d){
                return yScale(d.quantity[0])
            })
            .attr("transform", `translate(${Math.round(layout.margin.left-xScale(2)/2)},${layout.margin.top})`)
            .attr('class', 'fill-turquoise-0')
            .on("mouseover", function(d, i) {
                var div = d3.select("#chart-tooltip")
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html(tooltips[0].replace(':n', d.quantity[0]))
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function(d) {	
                var div = d3.select("#chart-tooltip")	
                div.transition()
                    .delay(2000)			
                    .duration(500)		
                    .style("opacity", 0);	
            });

            // deuxième barre graphique

            var barres2 = svg.append("g")
            .attr("transform", `translate(0, ${layout.margin.top})`)
            barres2.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('width', function(d){
                return 20;
            })
            .attr('height', function(d){
                return layout.height-layout.margin.top-layout.margin.bottom-yScale(d.quantity[1])
            })
            .attr("x", function(d){                
                return xScale(d.month)+30
            })
            .attr("y", function(d){
                return yScale(d.quantity[1])
            })
            .attr("transform", `translate(${Math.round(layout.margin.left-xScale(2)/2)},${layout.margin.top})`)
            .attr('class', 'fill-info-0')
            .on("mouseover", function(d, i) {
                var div = d3.select("#chart-tooltip")
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                div.html(tooltips[1].replace(':n', d.quantity[1]))
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function(d) { 
                var div = d3.select("#chart-tooltip")   
                div.transition()   
                    .delay(2000)	     
                    .duration(500)      
                    .style("opacity", 0);   
            });
    }

    render() {
        const titleStyle = {color:"#afaebc"}; 

        return <div className="bg-white pt-4 pb-4 text-center h-80 rounded">
            <h6 style={titleStyle} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>            
            <div ref="bar" className="vis p-5"></div>                        
        </div>
    }
}

export default Bar;