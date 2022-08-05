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
        this.addTransport = this.addTransport.bind(this)
        this.saveTransport = this.saveTransport.bind(this)
        this.removeSelectTransport = this.removeSelectTransport.bind(this)
        this.arrival_date = moment()
        this.departure_date = moment()
        this.handleAllReceptacleTransportChange = this.handleAllReceptacleTransportChange.bind(this)
        this.handleSearchAirport = this.handleSearchAirport.bind(this)
        this.handleSelectAirport = this.handleSelectAirport.bind(this)
        this.offClick = this.offClick.bind(this)
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
        const dp = $(this.refs.departure_date).datepicker(opts)
        const dp_arrival = $(this.refs.arrival_date).datepicker(opts)
        dp.on("changeDate", ()=>{
            this.departure_date = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
            $(this.refs.arrival_date).datepicker('setStartDate', moment(dp.datepicker('getDate')).toDate())
        });
        dp_arrival.on("changeDate", ()=>{
            this.arrival_date = moment(dp_arrival.datepicker('getDate')).format('YYYY-MM-DD')
        });
    }

    saveTransport() {
        if($(this.refs.frm_add_transport).parsley().validate()) {
            const departure_datetime = this.refs.departure_time.value
            const arrival_datetime = this.refs.arrival_time.value
            const values = {
                flight_id : this.props.data.id,
                reference : this.refs.conveyence_reference.value,
                departure_date : this.departure_date,
                departure_time : this.refs.departure_time.value,
                departure_datetime_lt : this.departure_date+' '+departure_datetime.substr(0,2)+':'+departure_datetime.substr(2,2)+':00',
                arrival_date : this.arrival_date,
                arrival_time : this.refs.arrival_time.value,
                departure_location : this.state.newairport,
                arrival_datetime_lt : this.arrival_date+' '+arrival_datetime.substr(0,2)+':'+arrival_datetime.substr(2,2)+':00',
                pivot : {
                    step : this.state.transport_index
                }
            }
            let cardit_ids = {}
            this.props.data.receptacles.map(receptacle=>{
                cardit_ids[receptacle.cardit_id] = 1
            })
            $.ajax({
                url : '/flight_transport',
                type : 'post',
                data : {...values, cardit_ids : Object.keys(cardit_ids), transport_index: this.state.transport_index},
                success : response=>{
                    this.setState(state=>{
                        state.allTransports[state.transport_index][state.step] = null
                        values.id = response.id
                        state.transports.push(values)
                        state.newairport = {
                            iata : ''
                        }
                        return state
                    })
                    this.refs.conveyence_reference.value = ''
                    this.departure_date = moment()
                    this.arrival_date = moment()
                    this.refs.departure_time.value = ''
                    this.refs.arrival_time.value = ''
                    $(this.refs.departure_date).datepicker('update', '');
                    $(this.refs.arrival_date).datepicker('update', '');
                    $(`#transport_popup_${this.props.pkey}`).modal('hide')
                }
            })
        }
    }

    addTransport() {
        $(`#transport_popup_${this.props.pkey}`).modal('show')
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

    removeSelectTransport(select_transport) {
        this.setState(state=>{
            state.transports = state.transports.filter(item=>item.id!=select_transport.id)
            return state
        })
    }

    handleAllReceptacleTransportChange(transport) {
        this.setState(state=>{
            state.allTransports[state.transport_index][state.step] = transport
            return state
        })
    }

    render() {
        return <tr className={`detail`}>
        <td colSpan="17" className="no-padding">
            <div className="bandeau">
                <span className="title-bandeau">{trans('Liste des récipients')} </span>
                <div className="centerText">
	            	{trans("Départ des récipients sur le vol Nº:vol au départ de l'aéroport :country_name - :iata - :airport_name", {vol:this.state.data.conveyence.reference, country_name:this.state.data.conveyence.departure_location.country.nom, iata:this.state.data.conveyence.departure_location.iata, airport_name:this.state.data.conveyence.departure_location.name})}
	        	</div>
            </div>
            <div className="recipientContainer">
                <div className="d-flex justify-content-center align-items-center stepContainer">
                    <div className={`recipientList d-flex flex-column justify-content-between align-items-center ${(this.state.step=='departure')?'red':(this.state.resdits.find(item=>{
                         return item.event=='departure'
                    })?'text-success':'')}`}>
                        <div className="mouse-pointable w-100" onClick={this.departure}>
                            <i className="font-50 l2-departure"></i>
                            <span className="text-capitalize">{trans('Départ')}</span>
                        </div>
                        <i className="fa fa-circle"></i>
                    </div>
                </div>
            </div>
            <div className="tableBottom">
				<Status key={`departure-${this.props.data.id}-${this.state.transport_index}`} readOnly={this.props.readOnly} data={this.state.data} transportIndex={this.state.transport_index} selectTransports={this.state.transports} addTransport={this.addTransport} consignmentEvent="departure" handleAllReceptacleTransportChange={transport=>this.handleAllReceptacleTransportChange(transport)} allTransport={this.state.allTransports[this.state.transport_index].departure} store={this.props.store} readOnly={this.props.readOnly}pkey={this.props.pkey}/>
            </div>
            <Popup id={`transport_popup_${this.props.pkey}`} className="modal-sm">
                <PopupBody>
                    <form className="text-left" ref="frm_add_transport">
                        <div className="form-group">
                            <label className="control-label">
                                {trans('Nº de vol')}
                            </label>
                            <input type="text" className="form-control bs-default" ref="conveyence_reference" required/>
                        </div>
                        <div className="form-group">
                            <label className="control-label text-capitalize">
                                {trans("Date de départ")}
                            </label>
                            <div ref="departure_date" className="input-group date">
                                <input type="text" className="form-control bs-default" required data-parsley-errors-container="#departure_date-error"/>
                                <div className="input-group-append"> 
                                    <button className="btn-primary btn text-light pl-3 pr-3" type="button"><i className="fa fa-calendar-alt"></i></button>
                                </div>
                            </div>
                            <span id="departure_date-error"></span>
                        </div>
                        <div className="form-group">
                            <label className="control-label">
                                {trans('Heure de départ')} HHMM
                            </label>
                            <input type="text" className="form-control bs-default" ref="departure_time" data-parsley-pattern="^\d{4}$" required/>
                        </div>
                        <div className="form-group">
                            <label className="control-label text-capitalize">
                                {trans("Date d'arrivée")}
                            </label>
                            <div ref="arrival_date" className="input-group date">
                                <input type="text" className="form-control bs-default" required data-parsley-errors-container="#arrival_date-error"/>
                                <div className="input-group-append"> 
                                    <button className="btn-primary btn text-light pl-3 pr-3" type="button"><i className="fa fa-calendar-alt"></i></button>
                                </div>
                            </div>
                            <span id="arrival_date-error"></span>
                        </div>
                        <div className="form-group">
                            <label className="control-label">
                                {trans("Heure d'arrivée")} HHMM
                            </label>
                            <input type="text" data-parsley-pattern="^\d{4}$" className="form-control bs-default" ref="arrival_time" required/>
                        </div>
                        {this.props.theme=='agent'?null:<div className="form-group">
                            <label className="control-label">
                                {trans('Aéroport de départ')}
                            </label>
                            <div className="input-group position-relative">
                                <input type="text" className="form-control bs-default" value={this.state.newairport.iata} onChange={this.handleSearchAirport} required/>
                                <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_airport?'show':''}`} style={{maxHeight:200}}>
                                    {this.state.select_airports.map(airport=><a key={`airport-${airport.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectAirport(e, airport)}>{airport.iata} ({airport.name} - {this.cast(airport, 'country.nom')})</a>)}
                                </div>
                            </div>
                        </div>}
                        <button className="btn btn-orange text-capitalize" type="button" onClick={this.saveTransport}>{trans('Confirmer')}</button>
                    </form>
                </PopupBody>
            </Popup>
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
        this.departure_date = React.createRef()
        this.edit = this.edit.bind(this)
    }

    edit() {
        $(`#infos-${this.props.data.id}`).modal('show')
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type==='flight_edit') {
                $(`#infos-${this.props.data.id}`).modal('hide')
                if(this.props.data.id == storeState.row.id) {
                    this.setState(state=>{
                        state.row_data.container_id = storeState.row.container_id
                        state.row_data.conveyence.reference = storeState.row.conveyence.reference
                        state.row_data.conveyence.departure_datetime_lt = storeState.row.conveyence.departure_datetime_lt
                        return state
                    })
                }
            }
        })
        const opts = {
            language : 'fr',
            autoclose : true
        }
        const dp = $(this.departure_date.current).datepicker(opts)
        dp.on("changeDate", ()=>{
            this.setState(state=>{
                state.row_data.conveyence.departure_datetime_lt = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
                return state
            })
        });
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
                <td className="green">{moment(this.cast(this.models('props.data.resdits', []).find(it=>it.nsetup.mld), 'nsetup.localtime', this.models('props.data.resdits.0.created_at'))).format('DD/MM/YYYY')}</td>
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
                <td><button className="btn" type="button" onClick={this.edit}><i className="fa fa-2x text-info fa-edit"></i></button>
                    <Popup id={`infos-${this.props.data.id}`} className="airport-modal">
                        <PopupHeader className="pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                            <h5><span className="text-body">{trans("Modifier")}</span></h5>
                        </PopupHeader>
                        <PopupBody>
                            <form className="text-left" method='post' name='frm_edit' action='/flight'>
                                <input type="hidden" name="ry"/>
                                <input type="hidden" name="id" value={this.props.data.id}/>
                                <div className="form-group">
                                    <label className="control-label">
                                        {trans('Nº de conteneur')}
                                    </label>
                                    <input type="text" name="container_id" className="form-control bs-default" required defaultValue={this.props.data.container_id}/>
                                </div>
                                <div className="form-group">
                                    <label className="control-label">
                                        {trans('Nº de vol')}
                                    </label>
                                    <input type="text" name="conveyence[reference]" className="form-control bs-default" required defaultValue={this.models('props.data.conveyence.reference')}/>
                                </div>
                                <div className="form-group">
                                    <label className="control-label text-capitalize">
                                        {trans("Date de départ")}
                                    </label>
                                    <div ref={this.departure_date} className="input-group date">
                                        <input type="text" className="form-control bs-default" required data-parsley-errors-container={`#departure_date-${this.props.data.id}-error`} defaultValue={moment(this.models('state.row_data.conveyence.departure_datetime_lt')).format('DD/MM/YYYY')}/>
                                        <div className="input-group-append"> 
                                            <button className="btn-primary btn text-light pl-3 pr-3" type="button"><i className="fa fa-calendar-alt"></i></button>
                                        </div>
                                    </div>
                                    <span id={`departure_date-${this.props.data.id}-error`}></span>
                                </div>
                                <input type="hidden" name="conveyence[departure_datetime_lt]" value={this.models('state.row_data.conveyence.departure_datetime_lt')}/>
                                <button className="btn btn-orange py-2 font-18 text-capitalize">{trans('Confirmer')}</button>
                            </form>
                        </PopupBody>
                    </Popup>
                </td>
            </tr>
            {(this.state.data && this.state.open)?<FullDetail step={this.state.step} theme={this.props.theme} data={this.state.data} pkey={this.state.pkey} consignmentEvents={this.state.consignment_events} deliveryConsignmentEvents={this.state.delivery_consignment_events} store={this.props.store} readOnly={this.props.readOnly}/>:null}
        </React.Fragment>
    }
}

export default Modelizer(Item);