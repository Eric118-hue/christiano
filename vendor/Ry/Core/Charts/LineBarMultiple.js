import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';
import './LineBar.scss';
import {DATES} from '../../../../app/translations';

export const LOCALEFR = d3.timeFormatLocale(DATES)

const LINE = 1
const BAR = 2

class LineBarMultiple extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            mode : LINE
        }
        this.switchMode = this.switchMode.bind(this)
    }

    switchMode(mode) {
        switch(mode) {
            case LINE:
                $("#bar-chart").addClass('d-none')
                $("#line-chart").removeClass('d-none')
                this.setState({mode:LINE})
                break;
            case BAR:
                $("#bar-chart").removeClass('d-none')
                $("#line-chart").addClass('d-none')
                this.setState({mode:BAR})
                break;
        }
    }

    componentDidMount() {
        var data = this.props.data.data[3].data[0].data
        const layout = {
            width: 340,
            height: 75,
            margin: {
                top : 10,
                right : 10,
                bottom : 10,
                left : 10
            }
        }

        var ar = []
        for(var i=0; i<data.length; i++) {
            ar.push(data[i].y)
        }

        var mylocale = d3.formatLocale({
            decimal : ',',
            thousand : '&nbsp;',
            currency: ['', ' Ar']
        })
        
        var xScale = d3.scaleTime().domain([new Date(2019, 0, 1), new Date(2019, 0, 22)]).range([0, layout.width-layout.margin.left-layout.margin.right])

        var yFormat = mylocale.format("$.0f")
        var yScale = d3.scaleLinear().domain([0,Math.max.apply(null, ar)]).range([layout.height-layout.margin.top, layout.margin.top])

        var svg = d3.select(this.refs.line).append("svg:svg")
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height);

        var line = d3.line()
            .x(function(d){
                return xScale(new Date(d.x))
            })
            .y(function(d){
                return yScale(d.y)
            })
        
        this.linecontainer = svg.append("g").attr("id", "line-chart")
        .attr("transform", `translate(${layout.margin.left},0)`)
        this.linecontainer.append("path")
            .datum(data)
            .attr("class", "line-light")
            .attr("d", line)

        var points = this.linecontainer.append("g")

        points.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot-10")
            .attr("cx", function(d){return xScale(new Date(d.x))})
            .attr("cy", function(d){return yScale(d.y)})
            .attr("r", 3)
            .on("mouseover", function(d, b, c) { 
                var div = d3.select("#chart-tooltip")
                div.html(function(){
                    var date = new Date(d.x);
                    return LOCALEFR.format("%d %b")(date)+'<br/>'+yFormat(d.y)
                })
                div.style("left", (d3.event.pageX - 10 - $('#chart-tooltip').width()/2) + "px")		
                    .style("top", (d3.event.pageY - 25 - $('#chart-tooltip').height()) + "px");
                    $('#chart-tooltip').addClass('tooltip-show')
            }).on("mouseout", function(d) {		
                $('#chart-tooltip').removeClass('tooltip-show');	
            });

        this.baries = svg.append("g").attr("transform", `translate(0,0)`).attr("id", "bar-chart").attr('class', 'd-none');
        this.baries.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('width', function(d){
                return 10;
            })
            .attr('height', function(d){
                return layout.height-yScale(d.y)
            })
            .attr("x", function(d){
                return xScale(new Date(d.x))
            })
            .attr("y", function(d){
                return yScale(d.y)
            })
            .attr("transform", `translate(2,0)`)
            .attr('class', 'fill-violet-4')
            .on("mouseover", function(d, i) {
                var div = d3.select("#chart-tooltip")	
                div.html(function(){
                    var date = new Date(d.x);
                    return LOCALEFR.format("%d %b")(date)+'<br/>'+yFormat(d.y)
                })
                div.style("left", (d3.event.pageX - 10 - $('#chart-tooltip').width()/2) + "px")		
                    .style("top", (d3.event.pageY - 25 - $('#chart-tooltip').height()) + "px");
                    $('#chart-tooltip').addClass('tooltip-show')
            }).on("mouseout", function(d) {	
                $('#chart-tooltip').removeClass('tooltip-show');	
            });
    }

    render() {
        return <div className="m-auto p-5 text-center text-light w-75">
            <h5>{this.props.data.title}</h5>
            <div className="btn-group linebar-toggle" role="group" aria-label="Basic example">
                <button type="button" className={`btn btn-sm btn-violet pb-0 ${this.state.mode===LINE?'active':''}`} onClick={()=>this.switchMode(LINE)}><i className="fa fa-chart-line"></i></button>
                <button type="button" className={`btn btn-sm btn-violet pb-0 ${this.state.mode===BAR?'active':''}`} onClick={()=>this.switchMode(BAR)}><i className="fa fa-chart-bar"></i></button>
            </div>
            <div ref="line" className="vis"></div>
        </div>
    }
}

export default LineBarMultiple;