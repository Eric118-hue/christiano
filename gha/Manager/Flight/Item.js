import React, {Component} from 'react';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from 'ryvendor/bs/bootstrap';
import $ from 'jquery';
import Status from './Status';
import trans from 'ryapp/translations';
import Ry from 'ryvendor/Ry/Core/Ry';
import qs from 'qs';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import numeral from 'numeral';

export class FullDetail extends Component
{
    constructor(props) {
        super(props)
        let allTransports = [{
            assignation : null,
            departure : null,
            arrival : null
        }]
        let data = this.props.data
        this.state = {
            data : this.props.data,
            step : 'departure',
            transport_index : 0,
            transports : [data.conveyence],
            allTransports : allTransports,
            newairport : {
                iata : ''
            },
            select_airport : false,
            select_airports : [],
            resdits : this.props.data.resdits
        }
        this.assignation = this.assignation.bind(this)
        this.departure = this.departure.bind(this)
        this.arrival_date = moment()
        this.departure_date = moment()
        this.handleSearchAirport = this.handleSearchAirport.bind(this)
        this.handleSelectAirport = this.handleSelectAirport.bind(this)
        this.offClick = this.offClick.bind(this)
        this.departure_date_input = React.createRef()
    }

    offClick() {
        this.setState({
            select_airport : false
        })
        $('body').off('click', this.offClick)
    }

    handleSearchAirport(event) {
        const value = event.target.value
        this.setState(state=>{
            state.newairport.iata = value
            return state
        })
        if(this.axRunning)
            this.axRunning.abort()

        this.axRunning = $.ajax({
            url : '/airports',
            data : {
                json : true,
                s : value
            },
            success : response=>{
                if(response.data && response.data.data.length>0) {
                    $('body').on('click', this.offClick)
                    this.setState({
                        select_airport : true,
                        select_airports : response.data.data
                    })
                }
            }
        })
    }

    handleSelectAirport(event, airport) {
        event.preventDefault()
        this.setState({
            newairport : airport,
            select_airport : false
        })
        return false
    }

    componentDidMount() {
        const opts = {
            startDate : moment(this.models('props.data.conveyence.departure_datetime_lt')).toDate(),
            language : 'fr',
            autoclose : true
        }
        const dp = $(this.departure_date_input.current).datepicker(opts)
        const dp_arrival = $(this.refs.arrival_date).datepicker(opts)
        dp.on("changeDate", ()=>{
            this.departure_date = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
            $(this.refs.arrival_date).datepicker('setStartDate', moment(dp.datepicker('getDate')).toDate())
            this.setState(state=>{
                state.data.conveyence.departure_datetime_lt = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
                return state
            })
        });
        dp_arrival.on("changeDate", ()=>{
            this.arrival_date = moment(dp_arrival.datepicker('getDate')).format('YYYY-MM-DD')
        });
    }

    assignation(transport_index) {
        this.setState({
            step : 'assignation',
            transport_index : transport_index
        })
    }

    departure() {
        this.setState({
            step : 'departure'
        })
    }

    render() {
        return <tr className={`detail`}>
        <td colSpan="13" className="no-padding">
            <div className="recipientContainer px-5">
                <form className="text-left" method='post' name='frm_edit' action='/flight'>
                    <input type="hidden" name="ry"/>
                    <input type="hidden" name="id" value={this.props.data.id}/>
                    <input type="hidden" name="conveyence_id" value={this.props.data.conveyence_id}/>
                    <div className='row'>
                        <div className='col-md-9'>
                            <div className='card'>
                                <div className='card-header bg-success text-center text-light' style={{textTransform:'none'}}>
                                    {trans('Si vous ne modifiez pas les informations ci-dessous, veuillez confirmer le départ')}
                                </div>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className="form-group col-md-3">
                                            <label className="control-label">
                                                {trans('Nº de conteneur')}
                                            </label>
                                            <input type="text" name="container_id" className="form-control bs-default" required defaultValue={this.props.data.container_id}/>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label className="control-label">
                                                {trans('Nº de vol')}
                                            </label>
                                            <input type="text" name="conveyence[reference]" className="form-control bs-default" required defaultValue={this.models('props.data.conveyence.reference')}/>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label className="control-label text-capitalize">
                                                {trans("Date de départ")}
                                            </label>
                                            <div ref={this.departure_date_input} className="input-group date">
                                                <input type="text" className="form-control bs-default" required data-parsley-errors-container={`#departure_date-${this.props.data.id}-error`} defaultValue={moment(this.models('state.row_data.conveyence.departure_datetime_lt')).format('DD/MM/YYYY')}/>
                                                <div className="input-group-append"> 
                                                    <button className="btn-primary btn text-light pl-3 pr-3" type="button"><i className="fa fa-calendar-alt"></i></button>
                                                </div>
                                            </div>
                                            <span id={`departure_date-${this.props.data.id}-error`}></span>
                                        </div>
                                        <div className='col-md-3'>
                                            <button className="btn btn-success text-light py-2 mt-3">{trans('Confirmer le départ')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" name="conveyence[departure_datetime_lt]" value={this.models('state.row_data.conveyence.departure_datetime_lt')}/>
                </form>
            </div>
            <div className="tableBottom">
				<Status key={`departure-${this.props.data.id}-${this.state.transport_index}`} readOnly={this.props.readOnly} data={this.state.data} transportIndex={this.state.transport_index} selectTransports={this.state.transports} addTransport={this.addTransport} consignmentEvent="departure" allTransport={this.state.allTransports[this.state.transport_index].departure} store={this.props.store} pkey={this.props.pkey}/>
            </div>
        </td>
    </tr>
    }
}

Modelizer(FullDetail)

class Item extends Component
{
    constructor(props) {
        super(props)
        this.state = {
			step : 'departure',
            data : null,
            row_data: this.props.data,
            open : false
        }
        this.detail = this.detail.bind(this)
        this.edit = this.edit.bind(this)
    }

    edit() {
        $(`#infos-${this.props.data.id}`).modal('show')
    }

    detail(e) {
        e.preventDefault()
        if(this.state.data) {
            this.setState({
                open : !this.state.open
            })
            return false
        }
        $.ajax({
            url : '/flight',
            data : {
                id : this.props.data.id,
                container_id : this.state.row_data.container_id,
                json : true
            },
            success : response=>{
                if(this.cast(response, 'data')) {
                    this.setState({
                        open : true,
                        data : response.data,
                        pkey : response.data.id,
                        delivery_consignment_events : response.delivery_consignment_events,
                        consignment_events : response.consignment_events
                    })
                }
            }
        })
        return false
    }

    render() {
        return <React.Fragment>
            <Ry/>
            <tr>
                <td className="green">{moment(this.models('props.data.created_at')).format('DD/MM/YYYY')}</td>
                <td>
                    <div className="d-flex align-items-center px-3">
                        <span className="d-inline-block px-2 list-document-number text-blue">{this.state.row_data.container_id}</span>
                        <a href="#" onClick={this.detail} className="btnAccord"><i className={`fa ${this.state.open?'fa-sort-up':'fa-sort-down'}`}></i></a>
                    </div>
                </td>
                <td>{this.models('props.data.receptacles', []).length}</td>
                <td>{numeral(this.models('props.data.total_weight')).format('0,0.0')} Kg</td>
                <td></td>
                <td>
                    {this.models('state.row_data.conveyence.reference')}
                </td>
                <td>
                    {moment(this.models('state.row_data.conveyence.departure_datetime_lt')).format('DD/MM/YYYY')} <span className="text-orange">{moment(this.models('state.row_data.conveyence.departure_datetime_lt')).format('HH:mm')}</span>
                </td>
                <td className="w-info">{this.models('props.data.conveyence.departure_location.iata')}</td>
                <td>{this.models('props.data.conveyence.arrival_location.iata')}</td>
                <td>
                    <a href={`/flightdoc?${qs.stringify({id:this.models('props.data.id')})}`} target="_blank"><i className="fa fa-file-contract fa-2x text-orange"></i></a>
                    {this.models('props.data.resdits', []).find(it=>it.event=='departure')?<i className="fa-2x l2-departure ml-2 text-orange"></i>:null}
                    {this.models('props.data.resdits', []).find(it=>it.event=='delivery')?<i className="fa-2x l2-destination ml-2 text-orange"></i>:null}
                </td>
                <td><button className="btn" type="button" onClick={this.props.archive}><i className="fa fa-2x text-danger fa-archive"></i></button></td>
                <td>

                </td>
                <td>

                </td>
            </tr>
            {(this.state.data && this.state.open)?<FullDetail step={this.state.step} theme={this.props.theme} data={this.state.data} pkey={this.state.pkey} consignmentEvents={this.state.consignment_events} deliveryConsignmentEvents={this.state.delivery_consignment_events} store={this.props.store} readOnly={this.props.readOnly}/>:null}
        </React.Fragment>
    }
}

export default Modelizer(Item);