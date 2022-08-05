import React, {Component} from 'react';
import moment from 'moment';
import $ from 'jquery';
import './css/bootstrap-datepicker.css';

class Datepicker extends Component
{
    constructor(props) {
        super(props)
        this.id = Math.random().toString(36).substring(7);
        this.input = React.createRef()
        this.state = {
            date : this.props.defaultValue?moment(this.props.defaultValue).format('YYYY-MM-DD'):''
        }
    }

    componentDidMount() {
        let opts = {
            zIndexOffset : 100,
            language : 'fr',
            autoclose : true,
            enableOnReadonly : false
        }
        if(this.props.min) {
            opts.startDate = this.props.min
        }
        if(this.props.max) {
            opts.endDate = this.props.max
        }
        const dp = $(this.input.current).datepicker(opts)
        dp.on("changeDate", ()=>{
            const value = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
            if(this.props.onChange)
                this.props.onChange(value)
            this.setState({
                date : value
            })
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.min && this.props.min!=prevProps.min) {
            $(this.input.current).datepicker('setStartDate', moment(this.props.min).toDate())
        }
        if(this.props.max && this.props.max!=prevProps.max) {
            $(this.input.current).datepicker('setEndDate', moment(this.props.max).toDate())
        }
    }

    render() {
        const otherProps = this.props.inputProps ? this.props.inputProps : {}
        const readOnly = this.props.readOnly ? {readOnly:true} : {}
        return <React.Fragment>
            <div ref={this.input} className={`input-group date ${this.props.className?this.props.className:'col-md-9'}`}>
                <input type="text" {...readOnly} className="form-control" defaultValue={this.props.defaultValue?moment(this.props.defaultValue).format("DD/MM/YYYY"):null} {...otherProps} data-parsley-errors-container={`#${this.id}`}/>
                <div className="input-group-append"> 
                    <button className="btn-primary btn text-light" type="button"><i className="fa fa-calendar-alt"></i></button>
                </div>
                <div id={this.id}></div>
            </div>
            <input type="hidden" name={this.props.name} value={this.state.date}/>
        </React.Fragment> 
    }
}

export default Datepicker;