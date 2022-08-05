import React, { Component } from 'react';
import trans from '../../../../app/translations';
import * as d3 from 'd3';
import $ from 'jquery';

class Bar extends Component
{
    constructor(props) {
        super(props)
        this.layout = {
            width: 640,
            height: 220,
            gutter : 10,
            margin: {
                top : 5,
                right : 30,
                bottom : 25,
                left : 30
            }
        }
        this.w = this.layout.width / 12
        this.g = this.w/5
        let values = []
        let sum = 0
        this.props.data.data[0].data.map(item=>{
            values.push(item.quantity)
            sum += item.quantity
        })
        let max = Math.max.apply(null, values)
        this.factor = this.layout.height / (sum>0?sum : max==0?1:max)
        this.tooltip = this.tooltip.bind(this)
        this.hideTooltip = this.hideTooltip.bind(this)
    }

    tooltip(event, content) {
        $('#chart-tooltip').html(content)
        $('#chart-tooltip').addClass('tooltip-show')
        $('#chart-tooltip').css('left', event.pageX - 10 - $('#chart-tooltip').width()/2)
        $('#chart-tooltip').css('top', event.pageY - 25 - $('#chart-tooltip').height())
    }

    hideTooltip(event) {
        $('#chart-tooltip').removeClass('tooltip-show')
    }

    render() {
        const layout = this.layout
        const w = this.w
        const g = this.g
        const fills = ['fill-violet-0', 'fill-primary-0', 'fill-yellow-0'];
        return <div className={`bg-white p-4 text-center rounded ${this.props.className}`}>
            <h6 style={{color:"#afaebc"}} dangerouslySetInnerHTML={{__html:this.props.data.title}}></h6>            
            <div className="vis p-3">
                <svg viewBox={`0 0 ${layout.width} ${layout.height}`} width={layout.width} height={layout.height} className="border-bottom border-success">
                    <g>
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map((i,key)=><g width={w} height={layout.height} key={`testen-${i}`} onMouseMove={event=>this.tooltip(event, this.props.data.data[0].data.length>i?this.props.data.data[0].data[i].quantity:0)} onMouseOut={this.hideTooltip}>
                            <rect x={w*i} width={w-g} height={layout.height} className="fill-stone-0"></rect>
                            <rect x={w*i} width={w-g} y={layout.height-(this.props.data.data[0].data.length>i?this.props.data.data[0].data[i].quantity*this.factor:0)} height={this.props.data.data[0].data.length>i?this.props.data.data[0].data[i].quantity*this.factor:0} className={fills[i%3]}></rect>
                        </g>)}
                    </g>
                </svg>
            </div>
            <div className="text-left text-muted" dangerouslySetInnerHTML={{__html:this.props.data.subtitle}}></div>                        
        </div>
    }
}

export default Bar;