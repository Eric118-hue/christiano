import React, {Component} from 'react';
import * as d3 from 'd3';
import trans from '../../../../app/translations';
import moment from 'moment';

class Knob extends Component
{
    constructor(props) {
        super(props)
        this.compute = this.compute.bind(this)
    }

    compute(now)  {
        const ngiven = moment.utc(this.props.to).local().diff(moment.utc(this.props.from).local())
        let endAngle
        switch(this.props.step) {
            case 'second':
                endAngle = moment.duration(ngiven - now.diff(moment.utc(this.props.from).local())).seconds()/60
                break;
            case 'minute':
                endAngle = moment.duration(ngiven - now.diff(moment.utc(this.props.from).local())).minutes()/60
                break;
            case 'hour':
                endAngle = moment.duration(ngiven - now.diff(moment.utc(this.props.from).local())).hours()/24
                break;
            case 'day':
                endAngle = moment.duration(ngiven - now.diff(moment.utc(this.props.from).local())).days()/moment.duration(ngiven).days()
                break;
        }
        if(endAngle<1/12)
            this.warningpath.attr("class", "fill-danger-0 blink_me")
        else
            this.warningpath.attr("class", "fill-danger-0 blink_me d-none")
        return 1-endAngle
    }

    componentWillUnmount() {
        if(this.interval)
            this.interval.stop()
    }

    componentDidMount() {
        const layout = {
            width: 300,
            height: 300,
            gutter : 10,
            margin: {
                top : 0,
                right : 0,
                bottom : 0,
                left : 0
            }
        }

        var svg = d3.select(this.refs.pie)
            .append('svg:svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${layout.width} ${layout.height}`)
            .attr('width', layout.width)
            .attr('height', layout.height)

        var bgwarning = d3.arc()
        .outerRadius(layout.width/2)
        .innerRadius(layout.width/2-layout.width/8)
        .startAngle(0)
        .endAngle(Math.PI*2)

        var bgarc = d3.arc()
        .outerRadius(layout.width/2-layout.width/20)
        .innerRadius(layout.width/2-layout.width/14)
        .startAngle(0)
		.endAngle(Math.PI*2)
        
        this.arc = d3.arc()
        .outerRadius(layout.width/2)
        .innerRadius(layout.width/2-layout.width/8)
        .startAngle(0)

        var containerbg = svg.append("g")
        .attr("transform", `translate(${layout.width/2}, ${layout.height/2})`)

        var containerwarning = svg.append("g")
        .attr("transform", `translate(${layout.width/2}, ${layout.height/2})`)

        this.warningpath = containerwarning.append("path")
            .attr("class", `fill-danger-0 blink_me d-none`)            
            .attr("d", bgwarning);

        var container = svg.append("g")
        .attr("transform", `translate(${layout.width/2}, ${layout.height/2})`)

        containerbg.append("path")
            .attr("class", `fill-grey-4`)            
            .attr("d", bgarc);

        const nowon = moment()

        this.pathy = container.append("path")
            .datum({endAngle:Math.PI*2*(this.compute(nowon))})
            .attr("class", `fill-${this.props.className}`)            
            .attr("d", this.arc);

        this.interval = d3.interval(()=>{
            this.pathy.transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attrTween("d", this.arcTween(Math.PI*2*(this.compute(moment()))))
        }, 1000)
    }

    arcTween(newAngle) {
        const dis = this
        return function(d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);

            return function(t) {
                d.endAngle = interpolate(t);
                return dis.arc(d)
            }
        }
    }

    render() {
        return <div className="charts position-relative" style={{marginRight:10}}>
            <div ref="pie" className="vis" style={{width:56}}></div>
            <div className="align-items-center d-flex h-100 justify-content-center position-absolute w-100" style={{top:0}}>
                <div className="text-center font-6">
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}

class Countdown extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            tick : moment()
        }
    }

    componentDidMount() {
        this.interval = d3.interval(()=>{
            this.setState({
                tick : moment()
            })
        })
    }

    componentWillUnmount() {
        if(this.interval)
            this.interval.stop()
    }

    render() {
        const ngiven = moment.utc(this.props.to).local().diff(moment.utc(this.props.from).local())
        const days = moment.duration(ngiven - this.state.tick.diff(moment.utc(this.props.from).local())).days()
        const hours = moment.duration(ngiven - this.state.tick.diff(moment.utc(this.props.from).local())).hours()+days*24
        const minutes = moment.duration(ngiven - this.state.tick.diff(moment.utc(this.props.from).local())).minutes()
        const seconds = moment.duration(ngiven - this.state.tick.diff(moment.utc(this.props.from).local())).seconds()
        return <div className="row">
            <Knob className="blue-0" step="hour" tick={this.state.tick} {...this.props}>
                <span className="text-uppercase">{trans('heures')}</span>
                <h3 className="mb-0" style={{lineHeight:'22px',fontWeight:'normal'}}>{hours>=0?hours:0}</h3>
            </Knob>
            <Knob className="success-0" step="minute" tick={this.state.tick} {...this.props}>
                <span className="text-uppercase">{trans('minutes')}</span>
                <h3 className="mb-0" style={{lineHeight:'22px',fontWeight:'normal'}}>{minutes>=0?minutes:0}</h3>
            </Knob>
            <Knob className="primary-0" step="second" tick={this.state.tick} {...this.props}>
                <span className="text-uppercase">{trans('secondes')}</span>
                <h3 className="mb-0" style={{lineHeight:'22px',fontWeight:'normal'}}>{seconds>=0?seconds:0}</h3>
            </Knob>
        </div>
    }
}

export default Countdown;