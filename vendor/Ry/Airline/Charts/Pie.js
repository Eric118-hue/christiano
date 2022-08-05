import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';
import numeral from 'numeral';

export const COLORS = ["success-0", "beige-0", "violet-0", "orange-0", "blue-5", "grass-0", "beige-0", "yellow-0", "poussin-0", "aubergine-0", "turquoise-0", "grey-0", "stone-0", "rose-0"];

class Pie extends Component
{
    constructor(props) {
        super(props)
        const items = [...this.props.data.data]
        items.sort((a, b)=>{
            return b.month - a.month
        })
        this.data = items
        this.colorIndex = this.props.colorIndex ? this.props.colorIndex : 0
    }

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

        var data = this.data

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
        .innerRadius(0)

        var container = svg.append("g")
        .attr("transform", `translate(${layout.width/2+layout.margin.left}, ${layout.height/2+layout.margin.top})`)

        const format = d3.format(".2f")

        const dis = this

        container.selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("class", function(d, i){
                let el = data[i]
                if('color' in el) {
                    return `fill-${el.color}-0`
                }
                return `fill-${COLORS[(i+dis.colorIndex)%COLORS.length]}`
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
                return `translate(${centroids[0]},${centroids[1]+(i%data.length*12)})`;
            })
            .text(function(d, i){
                return format(100*d.value/sum)+"%"
            })

    }

    render() {
        let listdata = [...this.data]
        listdata = listdata.slice(0, 3)
        return <React.Fragment>
            <div className="body d-flex align-items-center justify-content-center">
                <div ref="pie" className="vis" style={{height:145}}></div>
            </div>
            <div className="footer">
                <div className="container-fluid">
                    <div className="row">
                        {listdata.map((item, key)=>{
                            let bgcolor = COLORS[(key+this.colorIndex)%COLORS.length].replace(/-\d$/, '')
                            if('color' in item) {
                                bgcolor = item.color
                            }
                            return <div key={`pie-${this.props.data.id}-${key}`} className="col-12">
                            <div className="chartText d-flex align-items-center justify-content-between">
                                <span>
                                    <span className={`legend bg-${bgcolor}`}></span>
                                    <span className="text">{item.title}</span>
                                </span>
                                <span className="legendBold">{this.props.format?numeral(item.quantity).format(this.props.format):(numeral(item.quantity).format('0,0')+' Kg')}</span>
                            </div>
                        </div>})}
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

export default Pie;
