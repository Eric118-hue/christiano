import React, {Component} from 'react';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from 'ryvendor/bs/bootstrap';
import $ from 'jquery';
import Reception from './Reception';
import trans from '../../translations';
import Ry from 'ryvendor/Ry/Core/Ry';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import numeral from 'numeral';

export class StepView extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            transportIndex : 0,
            scans: []
        }
        this.assignate = this.assignate.bind(this)
        this.departure = this.departure.bind(this)
        this.arrival = this.arrival.bind(this)
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='scan') {
                this.setState(state=>{
                    if(storeState.data) {
                        state.scans = state.scans.concat(storeState.data)
                    }
                    else if(storeState.reception) {
                        state.scans = state.scans.concat(storeState.reception)
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
                <div className={`recipientList d-flex flex-column justify-content-between align-items-center ${this.props.step=='reception'?'red':(this.state.scans.find(item=>{
                        return (item.reception && item.reception.length>0) || item.event=='reception'
                    })?'text-success':'')}`}>
                    <div className="mouse-pointable w-100" onClick={this.props.reception}>
                        <i className="font-50 l2-receipt"></i>
                        <span className="text-capitalize">{trans('MLD REC')}</span>
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
            if(storeState.type=='scan' && storeState.data && storeState.data.length>0) {
                this.setState(state=>{
                    state.data.scans = state.data.scans.concat(storeState.data)
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
        return <div className="centerText">
            {trans("MLD REC envoyé le :date à :airline", {
                date: moment().format('DD/MM/YYYY'),
                airline: this.models('props.data.nsetup.transports.0.airlines.0')
            })}
        </div>
    }

    render() {
        return <tr className={`detail`}>
        <td colSpan="16" className="no-padding">
            <div className="bandeau">
                <span className="title-bandeau">{trans('Liste des récipients')} </span>
                {this.getHeadStep()}
            </div>
            {this.getStepView()}
            <div className="tableBottom">
                <Reception data={this.props.data} consignmentEvents={this.props.consignmentEvents} store={this.props.store} readOnly={this.props.readOnly}/>
            </div>
            <Popup id={`transport_popup_${this.props.data.id}`} className="modal-sm">
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
                        <div className="form-group">
                            <label className="control-label">
                                {trans('Aéroport de départ')}
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
            open : false,
            awb : this.models('props.data.lta.medias', []).length>0
        }
        this.detail = this.detail.bind(this)
        this.toAwb = this.toAwb.bind(this)
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if((storeState.type==='insert_awb' || storeState.type==='delete_awb') && storeState.cardit.id === this.props.data.id) {
                this.setState({
                    awb: storeState.type==='insert_awb'
                })
            }
        })
    }

    toAwb(e) {
        const awb = e.target.checked
        if(awb) {
            this.props.store.dispatch({
                type: 'insert_awb',
                cardit: this.props.data
            })
        }
        else {
            this.props.store.dispatch({
                type: 'delete_awb',
                cardit: this.props.data
            })
        }
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
            url : '/cardit_export',
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
        const nscanned = this.models('props.data.receptacles', []).filter(it=>it.scan_file_id).length
        let wscanned = 0
        this.models('props.data.receptacles', []).filter(it=>it.scan_file_id).map(it=>{
            wscanned += parseFloat(it.nsetup.weight)
        })
        return <React.Fragment>
            <Ry/>
            <tr className={`${this.props.bg}`}>
                <td className="green">{moment(this.models('props.data.nsetup.message_function')==1?this.props.data.nsetup.consignment_completion_lt:this.props.data.nsetup.preparation_datetime_lt).format('DD/MM/YYYY')}</td>
                <td className="green">{moment(this.models('props.data.nsetup.message_function')==1?this.props.data.nsetup.consignment_completion_lt:this.props.data.nsetup.preparation_datetime_lt).format('HH:mm')}</td>
                <td className='border-right-0'>
                    <div className="d-flex align-items-center px-3">
                        {this.models('props.data.nsetup.exceptions.bgms')?<i className="fa fa-2x fa-exclamation-triangle ml-2 text-danger"></i>:null}
                        {this.props.readOnly?<a href={`#dialog/cardit_file?id=${this.props.data.id}`} className="mr-2"><i className="icon-info"></i></a>:(this.models('props.data.nsetup.message_function')==1?<b className="text-danger mr-2">1</b>:null)}<span className={`d-inline-block px-2 list-document-number ${(this.models('props.data.nsetup.message_function')==1 && this.props.readOnly)?'text-danger':''}`}>{this.props.data.nsetup.document_number}</span>
                        {this.models('props.data.nsetup.exceptions.bgms')?null:<a href="#" onClick={this.detail} className="btnAccord"><i className={`fa ${this.state.open?'fa-sort-up':'fa-sort-down'}`}></i></a>}
                        <label className={`fancy-checkbox m-0 ml-4 ${this.props.nrows>1?'awb-checkbox':''} ${this.props.pindex==this.props.nrows-1?'awb-checkbox-last-child':''}`}>
                            <input type="checkbox" checked={this.state.awb} onChange={this.toAwb} disabled={this.props.destFocus && this.props.destFocus!=this.props.data.nsetup.handover_destination_location.id} value="1"/>
                            <span></span>
                        </label>
                    </div>
                </td>
                {(this.props.nrows>0 && this.props.pindex==0)?<td rowSpan={this.props.nrows+(this.state.groupOpen?1:0)} className='border-right-0 border-left-0'>
                    {this.models('props.data.lta.id')?<a href={`#dialog/awb?id=${this.models('props.data.lta.id')}`} className="btn-success ml-2 text-capitalize px-3 py-1 text-white w-auto awb-line" data-display="modal-xl">{trans('AWB')}</a>:null}
                </td>:null}
                <td className='border-left-0'>
                    {this.models('props.data.receptacles', []).filter(it=>it.scan_file_id).length>0?<a href={`#scan-${this.models('props.data.id')}`} className="btn-theme ml-2 text-capitalize px-3 py-1 text-white w-auto" data-display="modal-xl">{trans('Scan')}</a>:null}
                    {this.models('props.data.nsetup.consignment_category.code')=='A'?<a href={trans('/cn38?id=:id', {id:this.props.data.id})} target="_blank" className="btn-orange ml-2 px-3 py-1 text-white w-auto">CN 38</a>
                    :(this.models('props.data.nsetup.consignment_category.code')=='B' && mailclass_concat!='T')?<a href={trans('/cn41?id=:id', {id:this.props.data.id})} target="_blank" className="btn-orange ml-2 px-3 py-1 text-white w-auto">CN 41</a>
                    :(this.models('props.data.nsetup.consignment_category.code')=='B' && mailclass_concat=='T')?<a href={trans('/cn41?id=:id', {id:this.props.data.id})} type="button" className="btn-orange ml-2 px-3 py-1 text-white w-auto">CN 47</a>:null}
                    {this.models('props.data.nsetup.csd', []).length>0?<a href={`#dialog/csd?cardit_id=${this.models('props.data.id')}`} className={`btn-orange ml-2 px-3 py-1 text-white w-auto`}>{trans('CSD')}</a>:null}
                </td>
                <td>{this.models('props.data.nsetup.consignment_category.code')}</td>
                <td>{mailclasses}</td>
                <td className={nscanned>0?(this.props.data.nsetup.nreceptacles!=nscanned?'text-danger':'text-success'):''}>{this.props.data.nsetup.nreceptacles}</td>
                <td className={wscanned>0?(numeral(parseFloat(this.props.data.nsetup.wreceptacles)).format('0.00')!=numeral(wscanned).format('0.00')?'text-danger':'text-success'):''}>{numeral(parseFloat(this.props.data.nsetup.wreceptacles)).format('0,0.[00]')}</td>
                <td className="w-info">{this.props.data.nsetup.handover_origin_location.iata} <a href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#origin-${this.props.data.id}`).modal('show')
                }}><i className="icon-info"></i></a>
                    <Popup id={`origin-${this.props.data.id}`} className="airport-modal">
                        <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                            <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans("Aéroport d'origine")}</span></h5>
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
                                    {trans("Aéroport")} :
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
                                        <th>{trans('Aéroport')}</th>
                                        <th>{trans('Arrivée')}</th>
                                        <th>{trans('Départ')}</th>
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
                            <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{this.models('props.data.nsetup.handover_destination_location.cardit')?trans('Poste de destination'):trans('Aéroport de destination')}</span></h5>
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
                                    {trans('Aéroport')} :
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
                <td className="p-2">{moment(this.models('props.data.transports.0.departure_datetime_lt')).format('DD/MM/YYYY')}</td>
                <td className="p-2">{moment(this.models('props.data.transports.0.departure_datetime_lt')).format('HH:mm')}</td>
                <td className="p-2">{this.props.reception(this.props.data)}</td>
            </tr>
            {(this.state.data && this.state.open)?<FullDetail data={this.state.data} consignmentEvents={this.state.consignment_events} deliveryConsignmentEvents={this.state.delivery_consignment_events} store={this.props.store} readOnly={this.props.readOnly}/>:null}
        </React.Fragment>
    }
}

export default Modelizer(Item);