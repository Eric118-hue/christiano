import React, {Component} from 'react';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from '../../../bs/bootstrap';
import $ from 'jquery';
import Reception from './Reception';
import Assignation from './Assignation';
import Status from './Status';
import Delivery from './Delivery';
import trans from '../../../../app/translations';
import Ry from '../../Core/Ry';
import Modelizer from '../../Core/Modelizer';
import numeral from 'numeral';

export class StepView extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            transportIndex : 0,
            resdits : this.props.data.resdits
        }
        this.assignate = this.assignate.bind(this)
        this.departure = this.departure.bind(this)
        this.arrival = this.arrival.bind(this)
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='resdit') {
                this.setState(state=>{
                    if(storeState.data) {
                        state.resdits = state.resdits.concat(storeState.data)
                    }
                    else if(storeState.reception) {
                        state.resdits = state.resdits.concat(storeState.reception)
                    }
                    else if(storeState.delivery) {
                        state.resdits = state.resdits.concat(storeState.delivery)
                    }
                    return state
                })
            }
        })
    }

    assignate(index) {
        this.setState({
            transportIndex : index
        })
        this.props.assignation(index)
    }

    departure(index) {
        this.setState({
            transportIndex : index
        })
        this.props.departure(index)
    }

    arrival(index) {
        this.setState({
            transportIndex : index
        })
        this.props.arrival(index)
    }

    render() {
        return <div className="recipientContainer">
            <div className="d-flex justify-content-center align-items-center stepContainer">
                <div className="asideList">{this.props.data.nsetup.handover_origin_location.iata}</div>
                <div className={`recipientList d-flex flex-column justify-content-between align-items-center ${this.props.step=='reception'?'red':(this.state.resdits.find(item=>{
                        return (item.reception && item.reception.length>0) || item.event=='reception'
                    })?'text-success':'')}`}>
                    <div className="mouse-pointable w-100" onClick={this.props.reception}>
                        <i className="font-50 l2-receipt"></i>
                        <span className="text-capitalize">{trans('R??ception')}</span>
                    </div>
                    <i className="fa fa-circle"></i>
                </div>
                {this.props.data.nsetup.transports.map((transport, index)=><React.Fragment key={`cardit-${this.props.data.id}-transport-${index}`}>
                    <div className={`recipientList d-flex flex-column justify-content-between align-items-center ${(this.props.step=='assignation' && this.state.transportIndex==index)?'red':(this.state.resdits.find(item=>{
                        return item.event == 'assignation' && item.transport_step==index
                    })?'text-success':'')}`}>
                        <div className="mouse-pointable w-100" onClick={()=>this.assignate(index)}>
                            <i className="font-50 l2-warehouse"></i>
                            <span className="text-capitalize">{trans('Assignation')}</span>
                        </div>
                        <i className="fa fa-circle"></i>
                    </div>
                    <div className={`recipientList d-flex flex-column justify-content-between align-items-center  ${(this.props.step=='departure' && this.state.transportIndex==index)?'red':(this.state.resdits.find(item=>{
                        return item.event == 'departure' && item.transport_step==index
                    })?'text-success':'')}`}>
                        <div className="mouse-pointable w-100" onClick={()=>this.departure(index)}>
                            <i className="font-50 l2-departure"></i>
                            <span className="text-capitalize">{trans('D??part')}</span>
                        </div>
                        <i className="fa fa-circle"></i>
                    </div>
                    <div className={`recipientList d-flex flex-column justify-content-between align-items-center ${(this.props.step=='arrival' && this.state.transportIndex==index)?'red':(this.state.resdits.find(item=>{
                        return item.event == 'arrival' && item.transport_step==index
                    })?'text-success':'')}`}>
                        <div className="mouse-pointable w-100" onClick={()=>this.arrival(index)}>
                            <i className="font-50 l2-arrival"></i>
                            <span className="text-capitalize">{trans('Arriv??e')}</span>
                        </div>
                        <i className="fa fa-circle"></i>
                    </div>
                </React.Fragment>)}
                <div className={`recipientList d-flex flex-column justify-content-between align-items-center last ${this.props.step=='delivery'?'red':(this.state.resdits.find(item=>{
                        return item.event == 'delivery'
                    })?'text-success':'')}`}>
                    <div className="mouse-pointable w-100" onClick={this.props.delivery}>
                        <i className="font-50 l2-destination"></i>
                        <span className="text-capitalize">{trans('Livraison')}</span>
                    </div>
                    <i className="fa fa-circle"></i>
                </div>
                <div className="asideList asideList2">{this.models('props.data.nsetup.handover_destination_location.iata',this.models('props.data.nsetup.handover_destination_location.cardit'))}</div>
            </div>
        </div>
    }
}

Modelizer(StepView)

export class FullDetail extends Component
{
    constructor(props) {
        super(props)
        let allTransports = []
        let data = this.props.data
        data.nsetup.transports.map(transport=>{
            allTransports.push({
                assignation : null,
                departure : null,
                arrival : null
            })
        })
        this.state = {
            data : this.props.data,
            step : 'reception',
            transport_index : 0,
            transports : data.transports,
            allTransports : allTransports,
            newairport : {
                iata : ''
            },
            select_airport : false,
            select_airports : []
        }
        this.reception = this.reception.bind(this)
        this.assignation = this.assignation.bind(this)
        this.departure = this.departure.bind(this)
        this.delivery = this.delivery.bind(this)
        this.arrival = this.arrival.bind(this)
        this.addTransport = this.addTransport.bind(this)
        this.saveTransport = this.saveTransport.bind(this)
        this.removeSelectTransport = this.removeSelectTransport.bind(this)
        this.arrival_date = moment()
        this.departure_date = moment()
        this.handleAllReceptacleTransportChange = this.handleAllReceptacleTransportChange.bind(this)
        this.handleSearchAirport = this.handleSearchAirport.bind(this)
        this.handleSelectAirport = this.handleSelectAirport.bind(this)
        this.offClick = this.offClick.bind(this)
        this.getStepView = this.getStepView.bind(this)
        this.getHeadStep = this.getHeadStep.bind(this)
    }

    getStepView() {
        return <StepView data={this.props.data} step={this.state.step} store={this.props.store} reception={this.reception} assignation={transport_index=>this.assignation(transport_index)} departure={transport_index=>this.departure(transport_index)} arrival={transport_index=>this.arrival(transport_index)} delivery={this.delivery}/>
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

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidMount() {
        if(this.props.data.transports.length>0) {
            const opts = {
                startDate : moment(this.cast(this.props.data.transports.find(it=>it.pivot.step==0), 'departure_datetime_lt')).toDate(),
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
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='resdit' && storeState.data && storeState.data.length>0) {
                this.setState(state=>{
                    state.data.resdits = state.data.resdits.concat(storeState.data)
                    return state
                })
            }
        })
    }

    saveTransport() {
        if($(this.refs.frm_add_transport).parsley().validate()) {
            const departure_datetime = this.refs.departure_time.value
            const arrival_datetime = this.refs.arrival_time.value
            const values = {
                new : true,
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
            $.ajax({
                url : '/transports',
                type : 'post',
                data : {...values, cardit_id: this.props.data.id, transport_index: this.state.transport_index, json:true},
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
                    $(`#transport_popup_${this.props.data.id}`).modal('hide')
                }
            })
        }
    }

    addTransport() {
        $(`#transport_popup_${this.props.data.id}`).modal('show')
    }

    reception() {
        this.setState({
            step : 'reception'
        })
    }

    assignation(transport_index) {
        this.setState({
            step : 'assignation',
            transport_index : transport_index
        })
    }

    departure(transport_index) {
        this.setState({
            step : 'departure',
            transport_index : transport_index
        })
    }

    delivery() {
        this.setState({
            step : 'delivery'
        })
    }

    arrival(transport_index) {
        this.setState({
            step : 'arrival',
            transport_index : transport_index
        })
    }

    removeSelectTransport(select_transport) {
        this.setState(state=>{
            state.transports = state.transports.filter(item=>item.pivot.step==state.transportIndex && item.id!=select_transport.id)
            return state
        })
    }

    handleAllReceptacleTransportChange(transport) {
        this.setState(state=>{
            state.allTransports[state.transport_index][state.step] = transport
            return state
        })
    }

    getHeadStep() {
        let headStep = null;
        let transport = this.props.data.transports.find(it=>it.pivot.step==this.state.transport_index)
        switch(this.state.step) {
            case 'reception':
                headStep = <div className="centerText">
                    {trans("R??ception : r??cipients au d??part de l'a??roport d'origine")} : {this.props.data.nsetup.handover_origin_location.country.nom} - {this.props.data.nsetup.handover_origin_location.iata} - {this.props.data.nsetup.handover_origin_location.name}
                </div>
                break;
            case 'delivery':
                headStep = <div className="centerText">
                    {trans("Livraison des r??cipients ?? destination : :country_name - :iata - :airport_name", {
                        country_name : this.models('props.data.nsetup.handover_destination_location.country.nom', this.models('props.data.nsetup.handover_destination_location.adresse.ville.country.nom')),
                        iata : this.models('props.data.nsetup.handover_destination_location.iata', this.models('props.data.nsetup.handover_destination_location.cardit')),
                        airport_name : this.props.data.nsetup.handover_destination_location.name
                    })}
                </div>
                break;
            case 'assignation':
            //todo : choices available transport at same point
                headStep = <div className="centerText">
                    {trans("Assignation : r??cipients assign??s au vol :vol au d??part de l'a??roport :country_name - :iata - :airport_name", {vol:transport.reference, country_name:transport.departure_location.country.nom, iata:transport.departure_location.iata, airport_name:transport.departure_location.name})}
                </div>
                break;
            case 'departure':
                headStep = <div className="centerText">
                    {trans("D??part des r??cipients sur le vol N??:vol au d??part de l'a??roport :country_name - :iata - :airport_name", {vol:transport.reference, country_name:transport.departure_location.country.nom, iata:transport.departure_location.iata, airport_name:transport.departure_location.name})}
                </div>
                break;
            case 'arrival':
                headStep = <div className="centerText">
                    {trans("Arriv??e des r??cipients ?? l'a??roport :airport_name (:iata) - :country_name - Vol :vol", {vol:transport.reference, airport_name:this.cast(transport, 'arrival_location.name'), iata:this.cast(transport, 'arrival_location.iata', this.cast(transport, 'arrival_location.cardit')), country_name:this.cast(transport, 'arrival_location.country.nom', this.cast(transport, 'arrival_location.adresse.ville.country.nom'))})}
                </div>
                break;
        }
        return headStep
    }

    render() {
        let step = null;
        switch(this.state.step) {
            case 'reception':
                step = <Reception data={this.props.data} consignmentEvents={this.props.consignmentEvents} store={this.props.store} readOnly={this.props.readOnly}/>
                break;
            case 'delivery':
                step = <Delivery readOnly={this.props.readOnly} data={this.props.data} consignmentEvents={this.props.deliveryConsignmentEvents} store={this.props.store} readOnly={this.props.readOnly}/>
                break;
            case 'assignation':
            //todo : choices available transport at same point
                step = <Assignation key={`assignation-${this.props.data.id}-${this.state.transport_index}`} readOnly={this.props.readOnly} data={this.props.data} transportIndex={this.state.transport_index} selectTransports={this.state.transports.filter(it=>it.pivot.step==this.state.transport_index)} addTransport={this.addTransport} consignmentEvent="assignation" handleAllReceptacleTransportChange={transport=>this.handleAllReceptacleTransportChange(transport)} allTransport={this.state.allTransports[this.state.transport_index].assignation} store={this.props.store} readOnly={this.props.readOnly}/>
                break;
            case 'departure':
                step = <Status key={`departure-${this.props.data.id}-${this.state.transport_index}`} readOnly={this.props.readOnly} data={this.state.data} transportIndex={this.state.transport_index} selectTransports={this.state.transports.filter(it=>it.pivot.step==this.state.transport_index)} addTransport={this.addTransport} consignmentEvent="departure" handleAllReceptacleTransportChange={transport=>this.handleAllReceptacleTransportChange(transport)} allTransport={this.state.allTransports[this.state.transport_index].departure} store={this.props.store} readOnly={this.props.readOnly}/>
                break;
            case 'arrival':
                step = <Status key={`arrival-${this.props.data.id}-${this.state.transport_index}`} readOnly={this.props.readOnly} data={this.state.data} transportIndex={this.state.transport_index} selectTransports={this.state.transports.filter(it=>it.pivot.step==this.state.transport_index)} addTransport={this.addTransport} consignmentEvent="arrival" handleAllReceptacleTransportChange={transport=>this.handleAllReceptacleTransportChange(transport)} allTransport={this.state.allTransports[this.state.transport_index].arrival} store={this.props.store} readOnly={this.props.readOnly}/>
                break;
        }
        return <tr className={`detail`}>
        <td colSpan="14" className="no-padding">
            <div className="bandeau">
                <span className="title-bandeau">{trans('Liste des r??cipients')} </span>
                {this.getHeadStep()}
            </div>
            {this.getStepView()}
            <div className="tableBottom">
                {step}
            </div>
            <Popup id={`transport_popup_${this.props.data.id}`} className="modal-sm">
                <PopupBody>
                    <form className="text-left" ref="frm_add_transport">
                        <div className="form-group">
                            <label className="control-label">
                                {trans('N?? de vol')}
                            </label>
                            <input type="text" className="form-control bs-default" ref="conveyence_reference" required/>
                        </div>
                        <div className="form-group">
                            <label className="control-label text-capitalize">
                                {trans("Date de d??part")}
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
                                {trans('Heure de d??part')} HHMM
                            </label>
                            <input type="text" className="form-control bs-default" ref="departure_time" data-parsley-pattern="^\d{4}$" required/>
                        </div>
                        <div className="form-group">
                            <label className="control-label text-capitalize">
                                {trans("Date d'arriv??e")}
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
                                {trans("Heure d'arriv??e")} HHMM
                            </label>
                            <input type="text" data-parsley-pattern="^\d{4}$" className="form-control bs-default" ref="arrival_time" required/>
                        </div>
                        <div className="form-group">
                            <label className="control-label">
                                {trans('A??roport de d??part')}
                            </label>
                            <div className="input-group position-relative">
                                <input type="text" className="form-control bs-default" value={this.state.newairport.iata} onChange={this.handleSearchAirport} required/>
                                <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_airport?'show':''}`} style={{maxHeight:200}}>
                                    {this.state.select_airports.map(airport=><a key={`airport-${airport.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectAirport(e, airport)}>{airport.iata} ({airport.name} - {this.cast(airport, 'country.nom')})</a>)}
                                </div>
                            </div>
                            
                        </div>
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
            data : null,
            open : false
        }
        this.detail = this.detail.bind(this)
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
            url : '/cardit',
            data : {
                id : this.props.data.id,
                json : true
            },
            success : response=>{
                this.setState({
                    open : true,
                    data : response.data.data,
                    delivery_consignment_events : response.delivery_consignment_events,
                    consignment_events : response.consignment_events
                })
            }
        })
        return false
    }

    render() {
        let mailclasses = this.models('props.data.nsetup.mail_class.code')
        let mailclass_concat = Object.keys(this.models('props.data.nsetup.mail_classes', {})).join(' ')
        if(mailclass_concat)
            mailclasses = mailclass_concat
        return <React.Fragment>
            <Ry/>
            <tr>
                <td className="green">{moment(this.models('props.data.nsetup.message_function')==1?this.props.data.nsetup.consignment_completion_lt:this.props.data.nsetup.preparation_datetime_lt).format('DD/MM/YYYY')}</td>
                <td className="green">{moment(this.models('props.data.nsetup.message_function')==1?this.props.data.nsetup.consignment_completion_lt:this.props.data.nsetup.preparation_datetime_lt).format('HH:mm')}</td>
                <td>
                    <div className="d-flex align-items-center px-3">
                        {this.models('props.data.nsetup.exceptions.bgms')?<i className="fa fa-2x fa-exclamation-triangle ml-2 text-danger"></i>:null}
                        {this.props.readOnly?<a href={`#dialog/cardit_file?id=${this.props.data.id}`} className="mr-2"><i className="icon-info"></i></a>:(this.models('props.data.nsetup.message_function')==1?<b className="text-danger mr-2">1</b>:null)}<span className={`d-inline-block px-2 list-document-number ${(this.models('props.data.nsetup.message_function')==1 && this.props.readOnly)?'text-danger':''}`}>{this.props.data.nsetup.document_number}</span>
                        {this.models('props.data.nsetup.exceptions.bgms')?null:<a href="#" onClick={this.detail} className="btnAccord"><i className={`fa ${this.state.open?'fa-sort-up':'fa-sort-down'}`}></i></a>}
                        {this.models('props.data.lta')?<React.Fragment>
                            <a href={`#dialog/awb?cardit_id=${this.models('props.data.id')}`} target="_blank" className="btn-success ml-2 px-3 py-1 text-white w-auto" data-display="modal-xl">{trans('AWB')}</a>
                            {this.models('props.data.lta.medias', []).filter(it=>it.descriptif=='ffr').length>0?<a href={`#dialog/ffr?cardit_id=${this.models('props.data.id')}`} className={`btn-azur ml-2 px-3 py-1 text-white w-auto`}>{trans('FFR')}</a>:null}
                            {this.models('props.data.lta.medias', []).filter(it=>it.descriptif=='fwb').length>0?<a href={`#dialog/fwb?cardit_id=${this.models('props.data.id')}`} className={`btn-rose ml-2 px-3 py-1 text-white w-auto`}>{trans('FWB')}</a>:null}
                        </React.Fragment>:null}
                    </div>
                </td>
                <td>{this.models('props.data.nsetup.consignment_category.code')}</td>
                <td>{mailclasses}</td>
                <td>{this.props.data.nsetup.nreceptacles}</td>
                <td>{numeral(parseFloat(this.props.data.nsetup.wreceptacles)).format('0,0.[00]')}</td>
                <td className="w-info">{this.props.data.nsetup.handover_origin_location.iata} <a href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#origin-${this.props.data.id}`).modal('show')
                }}><i className="icon-info"></i></a>
                    <Popup id={`origin-${this.props.data.id}`} className="airport-modal">
                        <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                            <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans("A??roport d'origine")}</span></h5>
                        </PopupHeader>
                        <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                        <PopupBody>
                            <div className="row">
                                <div className="col-5 text-right text-grey">
                                    {trans("Pays")} :
                                </div>
                                <div className="col-7 text-left">
                                    {this.models('props.data.nsetup.handover_origin_location.country.nom')}
                                </div>
                                <div className="col-5 text-right text-grey">
                                    {trans("Code")} :
                                </div>
                                <div className="col-7 text-left">
                                    {this.models('props.data.nsetup.handover_origin_location.iata')}
                                </div>
                                <div className="col-5 text-right text-grey">
                                    {trans("A??roport")} :
                                </div>
                                <div className="col-7 text-left text-wrap">
                                    {this.models('props.data.nsetup.handover_origin_location.name')}
                                </div>
                            </div>
                        </PopupBody>
                    </Popup></td>
                <td className="p-2">{this.props.escales(this.props.data)}
                    <Popup id={`escales-${this.props.data.id}`}>
                        <PopupHeader>
                            {trans('Escales')}
                        </PopupHeader>
                        <PopupBody>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{trans('A??roport')}</th>
                                        <th>{trans('Arriv??e')}</th>
                                        <th>{trans('D??part')}</th>
                                        <th>{trans('Vol')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.data.nsetup.transports.slice(0, -1).map((transport, index)=>this.props.data.transports.find(it=>it.pivot.step==index+1)?<tr key={`escale-${this.props.data.id}-${index}`}>
                                        <td>{transport.arrival_location.iata} - {transport.arrival_location.name} - {transport.arrival_location.country.nom}</td>
                                        <td>{moment(transport.arrival_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                        <td>{moment(this.props.data.transports.find(it=>it.pivot.step==index+1).departure_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                        <td>{this.props.data.transports.find(it=>it.pivot.step==index+1).reference}</td>
                                    </tr>:null)}
                                </tbody>
                            </table>
                        </PopupBody>
                    </Popup></td>
                <td>{this.models('props.data.nsetup.handover_destination_location.iata', this.models('props.data.nsetup.handover_destination_location.cardit'))} <a href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#destination-${this.props.data.id}`).modal('show')
                }}><i className="fa fa-info-circle text-turquoise"></i></a>
                    <Popup id={`destination-${this.props.data.id}`} className="airport-modal">
                        <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                            <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{this.models('props.data.nsetup.handover_destination_location.cardit')?trans('Poste de destination'):trans('A??roport de destination')}</span></h5>
                        </PopupHeader>
                        <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                        <PopupBody>
                            {this.models('props.data.nsetup.handover_destination_location.cardit')?<div className="row">
                                <div className="col-5 text-right text-grey">
                                    {trans("Pays")} :
                                </div>
                                <div className="col-7 text-left">
                                    {this.models('props.data.nsetup.handover_destination_location.adresse.ville.country.nom')}
                                </div>
                                <div className="col-5 text-right text-grey">
                                    {trans("Ville")} :
                                </div>
                                <div className="col-7 text-left">
                                    {this.models('props.data.nsetup.handover_destination_location.adresse.ville.nom')}
                                </div>
                                <div className="col-5 text-right text-grey">
                                    {trans("Code")} :
                                </div>
                                <div className="col-7 text-left">
                                    {this.models('props.data.nsetup.handover_destination_location.cardit')}
                                </div>
                                <div className="col-5 text-right text-grey">
                                    {trans("Poste")} :
                                </div>
                                <div className="col-7 text-left text-wrap">
                                    {this.models('props.data.nsetup.handover_destination_location.name')}
                                </div>
                            </div>:<div className="row">
                                <div className="col-5 text-right text-grey">
                                    {trans('Pays')} :
                                </div>
                                <div className="col-7 text-left">
                                    {this.models('props.data.nsetup.handover_destination_location.country.nom')}
                                </div>
                                <div className="col-5 text-right text-grey">
                                    {trans('Code')} :
                                </div>
                                <div className="col-7 text-left">
                                    {this.models('props.data.nsetup.handover_destination_location.iata')}
                                </div>
                                <div className="col-5 text-right text-grey">
                                    {trans('A??roport')} :
                                </div>
                                <div className="col-7 text-left text-wrap">
                                    {this.models('props.data.nsetup.handover_destination_location.name')}
                                </div>
                            </div>}
                        </PopupBody>
                    </Popup></td>
                <td>
                    {this.cast(this.props.data.transports.find(it=>it.pivot.step==0), 'reference')} <a href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#conveyence-${this.props.data.id}`).modal('show')
                }}><i className="fa fa-info-circle text-turquoise"></i></a>
                    <Popup id={`conveyence-${this.props.data.id}`} className="airport-modal">
                        <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                            <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('Premier vol')}</span></h5>
                        </PopupHeader>
                        <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                        <PopupBody>
                            <div dangerouslySetInnerHTML={{__html:this.models('props.data.nsetup.transports.0.airlines', []).join('<br/>')}}></div>
                        </PopupBody>
                    </Popup>
                </td>
                <td className="p-2">{this.props.reception(this.props.data)}</td>
                <td className="p-2">{this.props.assignation(this.props.data)}</td>
                <td className="p-2">{this.props.completed(this.props.data)}</td>
            </tr>
            {(this.state.data && this.state.open)?<FullDetail data={this.state.data} consignmentEvents={this.state.consignment_events} deliveryConsignmentEvents={this.state.delivery_consignment_events} store={this.props.store} readOnly={this.props.readOnly}/>:null}
        </React.Fragment>
    }
}

export default Modelizer(Item);