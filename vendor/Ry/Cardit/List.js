import React, {Component} from 'react';
import $ from 'jquery';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from '../../bs/bootstrap';
import numeral from 'numeral';
import trans from '../../../app/translations';
import NavigableModel from '../../Ry/Core/NavigableModel';
import Modelizer from '../../Ry/Core/Modelizer';
import { throws } from 'assert';

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.endpoint = '/cardits'
        this.model = 'cardit'
        this.nopaginate = true
        this.readOnly = false
        this.state.date = moment().format('YYYY-MM-DD')
        this.state.datefilter = 'date'
        this.state.filter = {
            prepared_at : this.models('props.data.filter.prepared_at', moment()),
            prepared_at_year : this.models('props.data.filter.prepared_at_year', moment().year()),
            airline_id : '',
            handover_origin_location : this.models('props.data.handover_origin_location', ''),
            document_number : this.models('props.data.document_number', ''),
            //handover_destination_location : '',
            //conveyence_reference : ''
        }
        this.xhrdata = {...this.state.filter}
        this.xhrdata.prepared_at = moment(this.xhrdata.prepared_at).format('YYYY-MM-DD')
        this.table = this.table.bind(this)
        this.beforelist = this.beforelist.bind(this)
        this.onFilter = this.onFilter.bind(this)
        let criterias = this.models('props.data.filter', {})
        this.data = {
            json : true,
            s : Array.isArray(criterias) ? {} : criterias 
        }
        this.afterTd = this.afterTd.bind(this)
        this.afterTh = this.afterTh.bind(this)
        this.search = this.search.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckAll = this.handleCheckAll.bind(this)
        this.validateCardit = this.validateCardit.bind(this)
        this.documentSearch = this.documentSearch.bind(this)
        this.handleDateChecked = this.handleDateChecked.bind(this)
        this.handleYearChecked = this.handleYearChecked.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
    }

    handleYearChecked(event) {
        if(event.target.checked) {
            if(this.pxhr)
                this.pxhr.abort()
            this.setState({
                data : [],
                datefilter : event.target.value,
                total : 0
            })
            this.urls = []
            this.data.s = {...this.state.filter}
            delete this.data.s.prepared_at
            delete this.data.s.document_number
            if(this.request) {
                this.request.abort()
            }
            this.request = $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.total = response.data.total
                        state.page = response.data.current_page
                        return state
                    })
                    window.setTimeout(this.progress, 100)
                }
            })
        }
    }

    handleDateChecked(event) {
        if(event.target.checked) {
            if(this.pxhr)
                this.pxhr.abort()
            this.setState({
                data : [],
                datefilter : event.target.value,
                total : 0
            })
            this.urls = []
            this.data.s = {...this.state.filter}
            if(this.data.s.prepared_at)
                this.data.s.prepared_at = moment(this.data.s.prepared_at).format('YYYY-MM-DD')
            delete this.data.s.document_number
            delete this.data.s.prepared_at_year
            if(this.request) {
                this.request.abort()
            }
            this.request = $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        state.total = response.data.total
                        return state
                    })
                    this.urls = []
                    window.setTimeout(this.progress, 100)
                }
            })
        }
    }

    handleYearChange(event) {
        const value = event.target.value
        this.setState(state=>{
            state.filter.prepared_at_year = value
            return state
        })
        if(this.state.datefilter=='year') {
            if(this.pxhr)
                this.pxhr.abort()
            this.data.s = {...this.state.filter}
            this.data.s.prepared_at_year = value
            this.setState(state=>{
                state.data = [],
                state.total = 0
                return state
            })
            this.urls = []
            delete this.data.s.prepared_at
            delete this.data.s.document_number
            if(this.request) {
                this.request.abort()
            }
            this.request = $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        state.total = response.data.total
                        return state
                    })
                    window.setTimeout(this.progress, 100)
                }
            })
        }
    }

    handleCheck(event, receptacle, cardit) {
        const value = event.target.checked
        this.setState(state=>{
            state.data.map(i_cardit=>{
                if(cardit.id==i_cardit.id) {
                    i_cardit.receptacles.map(i_receptacle=>{
                        if(i_receptacle.id==receptacle.id)
                            i_receptacle.selected = value
                    })
                }
            })
            return state
        })
    }

    validateCardit(cardit) {
        $.ajax({
            url : '/receptacles',
            type : 'post',
            data : {...this.state.data.find(item=>item.id==cardit.id)},
            success : ()=>{
                $(`#receptacles-${cardit.id}`).modal('hide')
            }
        })
    }

    handleCheckAll(event, cardit) {
        const value = event.target.checked
        this.setState(state=>{
            state.data.map(i_cardit=>{
                if(cardit.id==i_cardit.id) {
                    i_cardit.selected = value
                    i_cardit.receptacles.map(i_receptacle=>{
                        i_receptacle.selected = value
                    })
                }
            })
            return state
        })
    }

    handleFilter(event, field) {
        const value = event.target.value
        this.setState(state=>{
            state.filter[field] = value
            return state
        })
    }

    search() {
        this.data.s.handover_origin_location = this.state.filter.handover_origin_location
        this.data.s.document_number = this.state.filter.document_number
        this.data.s.handover_destination_location = this.state.filter.handover_destination_location
        this.data.s.conveyence_reference = this.state.filter.conveyence_reference
        $.ajax({
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.setState({
                    items : response.data.data
                })
            }
        })
    }

    afterTd(cardit) {

    }

    afterTh() {

    }

    onFilter(event, field) {
        const value = event.target.value
        if(this.pxhr)
            this.pxhr.abort()
        this.setState(state=>{
            state.filter[field] = value
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s = {...this.state.filter}
        if(this.state.datefilter=='year')
            delete this.data.s.prepared_at
        if(this.state.datefilter=='date' && this.data.s.prepared_at)
            this.data.s.prepared_at = moment(this.data.s.prepared_at).format('YYYY-MM-DD')
        delete this.data.s.document_number
        this.data.s[field] = value
        if(this.request) {
            this.request.abort()
        }
        this.request = $.ajax({
            isPagination : true,
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.setState(state=>{
                    state.data = response.data.data,
                    state.last_page = response.data.last_page
                    state.page = response.data.current_page
                    state.total = response.data.total
                    return state
                })
                window.setTimeout(this.progress, 100)
            }
        })
    }

    beforelist() {

    }

    componentDidMount() {
        super.componentDidMount()
        const opts = {
            //zIndexOffset : 100,
            language : 'fr',
            autoclose : true
        }
        const dp = $(this.refs.datepicker).datepicker(opts)
        dp.on("changeDate", ()=>{
            if(this.state.datefilter!='date')
                return

            const date = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.filter.prepared_at = date
                state.date = date
                state.data = []
                state.total = 0
                return state
            })
            this.urls = []
            this.data.s.prepared_at = date
            delete this.data.s.prepared_at_year
            $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        state.total = response.data.total
                        return state
                    })
                    window.setTimeout(this.progress, 1)
                }
            })
        });
        $(this.refs.frm_receptacles).ajaxForm()
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='cardit' && storeState.row) {
                this.setState(state=>{
                    state.data = state.data.filter(it=>(it.nsetup.document_number!=storeState.row.nsetup.document_number || (it.nsetup.document_number==storeState.row.nsetup.document_number && it.id==storeState.row.id)))
                    return state
                })
            }
        })
    }

    documentSearch() {
        const field = 'document_number'
        const value = this.refs.document_number.value
        if(this.pxhr)
            this.pxhr.abort()
        this.setState(state=>{
            state.filter.document_number = value
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s[field] = value
        delete this.data.s.prepared_at
        delete this.data.s.prepared_at_year
        delete this.data.s.handover_origin_location
        if(this.request) {
            this.request.abort()
        }
        this.request = $.ajax({
            isPagination : true,
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.setState({
                    data : response.data.data,
                    last_page : response.data.last_page,
                    page : response.data.current_page,
                    total : response.data.total
                })
                window.setTimeout(this.progress, 100)
            }
        })
    }

    escales(cardit) {
        let k = cardit.nsetup.transports.length
        switch(k) {
            case 1:
                return <div>{trans('Direct')}</div>
            case 2:
                return <a className="btn btn-turquoise cursor-default d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${cardit.id}`).modal('show')
                }}><span className="font-12">{trans('1 escale')}</span><i className="icon-pencil"></i></a>
            case 3:
                return <a className="btn btn-turquoise cursor-default d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${cardit.id}`).modal('show')
                }}><span className="font-12">{trans(':n escales', {n:2})}</span><i className="icon-pencil"></i></a>
            
        }
    }

    reception(cardit) {
        let k = 0
        let nmrd = 0
        if(cardit.resdits && cardit.resdits.find(item=>{
            return item.event == 'reception'
        })) {
            k = 2
            let item = cardit.resdits.find(item=>{
                return item.event == 'reception'
            })
            if(item.receptacles.find(receptacle=>{
                return receptacle.nsetup.mrd
            })) {
                k = 1
                nmrd = 0
                cardit.resdits.map(resdit=>{
                    resdit.receptacles.map(receptacle=>{
                        if(receptacle.nsetup.mrd)
                            nmrd++
                    })
                })
            }
        }
            
        switch(k) {
            case 0:
                return <a className={`btn btn-danger cursor-default d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><span></span><span>NT</span> {true?null:<i className="icon-pencil"></i>}</a>
            case 1:
                return <a className="btn btn-blue cursor-default d-flex text-white justify-content-center pr-1 align-items-center" href="#" style={{height:34}}>MRD</a>
            case 2:
                return <a className={`btn btn-success cursor-default d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><span></span><i className="fa fa-check text-white"></i>{true?null:<i className="fa fa-info-circle text-white"></i>}</a>
            
        }
    }

    assignation(cardit) {
        let k = 0
        if(cardit.resdits && cardit.resdits.find(item=>{
            return item.event == 'assignation'
        }))
            k = 2
        switch(k) {
            case 0:
                return <a className={`btn btn-danger cursor-default d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><span></span><span>NT</span>{true?null:<i className="icon-pencil"></i>}</a>
            case 1:
                return <a className="btn text-white cursor-default d-flex justify-content-between pr-1 align-items-center" href="#" style={{background:'#ff7c07',height:34}}><span></span><span>NT</span><i className="icon-pencil"></i></a>
            case 2:
                return <a className={`btn btn-success cursor-default d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><span></span><i className="fa fa-check text-white"></i> {true?null:<i className="fa fa-info-circle text-white"></i>}</a>
            
        }
    }

    completed(cardit) {
        let k = 0
        let nmrd = 0
        if(cardit.resdits && cardit.resdits.find(item=>{
            return item.event == 'delivery'
        })) {
            k = 2
            let item = cardit.resdits.find(item=>{
                return item.event == 'delivery'
            })
            if(item.receptacles.find(receptacle=>{
                return receptacle.nsetup.mrd
            })) {
                k = 1
                nmrd = 0
                cardit.resdits.map(resdit=>{
                    resdit.receptacles.map(receptacle=>{
                        if(receptacle.nsetup.mrd)
                            nmrd++
                    })
                })
            }
        } 
        switch(k) {
            case 0:
                return <a className={`btn btn-danger cursor-default d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><span>NT</span>{true?null:<i className="icon-pencil"></i>}</a>
            case 1:
                return <a className="btn btn-blue cursor-default d-flex text-white justify-content-center pr-1 align-items-center" href="#" style={{height:34}}>MRD</a>
            case 2:
                return <a className={`btn btn-success cursor-default text-white d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><i className="fa fa-check text-white"></i> {true?null:<i className="fa fa-info-circle text-white"></i>}</a>
            
        }
    }

    table() {
        return <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0"
        id="addrowExample">
            <thead>
                <tr>
                    <th>{trans('Emis le')}</th>
                    <th>{trans('à')}</th>
                    <th>{trans('N° d’expédition')}</th>
                    <th>{trans('Cat.')}</th>
                    <th>{trans('Clas.')}</th>
                    <th>{trans('Qté')}</th>
                    <th>{trans('Poids')}</th>
                    <th>{trans('Orig.')}</th>
                    <th>{trans('Escale')}</th>
                    <th>{trans('Dest.')}</th>
                    <th>{trans('Nº de vol')}</th>
                    <th style={{width:104}}>{trans('Irrégularités')}</th>
                    <th style={{width:104}}>{trans('Performances')}</th>
                    <th style={{width:104}}>{trans('Trip completed')}</th>
                    {this.afterTh()}
                </tr>
            </thead>
            <tbody>
                {this.state.data.map(item=><tr key={`cardit-${item.id}`} className="gradeA">
                    <td>{moment.utc(item.nsetup.preparation_datetime).local().format('DD/MM/YYYY')}</td>
                    <td>{moment(item.nsetup.preparation_datetime_lt).format('HH:mm')}</td>
                    <td className="actions"><a href={`#dialog/cardit_file?id=${item.id}`}><i className="icon-info"></i></a> {item.nsetup.document_number} <a href="#" className="btn-sm btn-icon btn-pure btn-turquoise on-default ml-2 m-r-5 button-edit" onClick={e=>{
                        e.preventDefault()
                        $(`#receptacles-${item.id}`).modal('show')
                    }}>
                        <i className="icon-pencil" aria-hidden="true"></i></a>
                        <Popup id={`receptacles-${item.id}`} className="modal-xl">
                            <PopupHeader className="bg-info text-light">
                                <h4>{trans('Liste des récipients')} - {trans('Expédition')} {item.nsetup.document_number}</h4>
                            </PopupHeader>
                            <PopupBody>
                                <div className="col-md-12">
                                    <table className="table table-bordered table-centerall">
                                        <thead>
                                            <tr>
                                                <th>{trans('N°')}</th>
                                                <th>{trans('Numéro du récipient')}</th>
                                                <th>{trans('Flag')} <i className="fa fa-info-circle"></i></th>
                                                <th>{trans('Container Journey ID')}</th>
                                                <th>{trans('Type de récipient')}</th>
                                                <th>{trans('Poids (Kg)')}</th>
                                                <th>
                                                    <div className="d-flex justify-content-center">
                                                        <div className="fancy-checkbox mr-0">
                                                            <label className="m-0">
                                                                <input name={`checkbox${item}`} type="checkbox" value="1" checked={item.selected===true} onChange={e=>this.handleCheckAll(e, item)}/>
                                                                <span></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.receptacles.map((receptacle, index)=><tr key={`content-${receptacle.id}`}>
                                                <td>{numeral(index+1).format('00')}</td>
                                                <td>{receptacle.nsetup.receptacle_id}</td>
                                                <td>{receptacle.nsetup.handling}</td>
                                                <td>{receptacle.nsetup.nesting}</td>
                                                <td>{receptacle.nsetup.type.interpretation}</td>
                                                <td>{receptacle.nsetup.weight}</td>
                                                <td>
                                                    <div className="d-flex justify-content-center">
                                                        <div className="fancy-checkbox mr-0">
                                                            <label className="m-0">
                                                                <input name={`receptacles[${receptacle.id}]`} type="checkbox" value="1" checked={receptacle.selected===true} onChange={e=>this.handleCheck(e, receptacle, item)}/>
                                                                <span></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>)}
                                        </tbody>
                                    </table>
                                    <input type="hidden" name="ry"/>
                                    <button className="float-right btn btn-orange" type="button" onClick={()=>this.validateCardit(item)}>{trans('Validation')}</button>
                                </div>
                            </PopupBody>
                        </Popup>            
                    </td>
                    <td>{item.nsetup.consignment_category.code}</td>
                    <td>{item.nsetup.mail_class.code}</td>
                    <td>{item.nsetup.nreceptacles}</td>
                    <td>{item.nsetup.wreceptacles}</td>
                    <td>{item.nsetup.handover_origin_location.iata} <a href="#" onClick={e=>{
                        e.preventDefault()
                        $(`#origin-${item.id}`).modal('show')
                    }}><i className="fa fa-info-circle text-turquoise"></i></a>
                        <Popup id={`origin-${item.id}`} className="airport-modal">
                            <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans("Aéroport d'origine")}</span></h5>
                            </PopupHeader>
                            <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                            <PopupBody>
                                <div className="row">
                                    <div className="col-5 text-right text-grey">
                                        {trans('Pays')} :
                                    </div>
                                    <div className="col-7 text-left">
                                        {item.nsetup.handover_origin_location.country.nom}
                                    </div>
                                    <div className="col-5 text-right text-grey">
                                        {trans('Code')} :
                                    </div>
                                    <div className="col-7 text-left">
                                        {item.nsetup.handover_origin_location.iata}
                                    </div>
                                    <div className="col-5 text-right text-grey">
                                        {trans('Aéroport')} :
                                    </div>
                                    <div className="col-7 text-left text-wrap">
                                        {item.nsetup.handover_origin_location.name}
                                    </div>
                                </div>
                            </PopupBody>
                        </Popup>
                    </td>
                    <td className="p-2">{this.escales(item)}
                        <Popup id={`escales-${item.id}`}>
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
                                        {item.nsetup.transports.slice(0, -1).map((transport, index)=><tr key={`escale-${item.id}-${index}`}>
                                            <td>{transport.arrival_location.iata} - {transport.arrival_location.name} - {transport.arrival_location.country.nom}</td>
                                            <td>{moment(transport.arrival_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{moment(item.nsetup.transports[index+1].departure_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{item.nsetup.transports[index+1].conveyence_reference}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </PopupBody>
                        </Popup>
                    </td>
                    <td>{item.nsetup.handover_destination_location.iata} <a href="#" onClick={e=>{
                        e.preventDefault()
                        $(`#destination-${item.id}`).modal('show')
                    }}><i className="fa fa-info-circle text-turquoise"></i></a>
                        <Popup id={`destination-${item.id}`} className="airport-modal">
                            <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('Aéroport de destination')}</span></h5>
                            </PopupHeader>
                            <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                            <PopupBody>
                                <div className="row">
                                    <div className="col-5 text-right text-grey">
                                        {trans('Pays')} :
                                    </div>
                                    <div className="col-7 text-left">
                                        {item.nsetup.handover_destination_location.country.nom}
                                    </div>
                                    <div className="col-5 text-right text-grey">
                                        {trans('Code')} :
                                    </div>
                                    <div className="col-7 text-left">
                                        {item.nsetup.handover_destination_location.iata}
                                    </div>
                                    <div className="col-5 text-right text-grey">
                                        {trans('Aéroport')} :
                                    </div>
                                    <div className="col-7 text-left text-wrap">
                                        {item.nsetup.handover_destination_location.name}
                                    </div>
                                </div>
                            </PopupBody>
                        </Popup>
                    </td>
                    <td>{item.nsetup.transports[0].conveyence_reference} <a href="#" onClick={e=>{
                        e.preventDefault()
                        $(`#conveyence-${item.id}`).modal('show')
                    }}><i className="fa fa-info-circle text-turquoise"></i></a>
                        <Popup id={`conveyence-${item.id}`} className="airport-modal">
                            <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('Premier vol')}</span></h5>
                            </PopupHeader>
                            <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                            <PopupBody>
                                {item.nsetup.transports[0].airlines.join('<br/>')}
                            </PopupBody>
                        </Popup>
                    </td>
                    <td>{this.reception(item)}</td>
                    <td>{this.assignation(item)}</td>
                    <td>{this.completed(item)}</td>
                    {this.afterTd(item)}
                </tr>)}
            </tbody>
            <tfoot>
                <tr>
                    <td>{trans('Chargement...')}</td>
                </tr>
            </tfoot>
        </table>
    }

    render() {
        let years = []
        for(var i=moment().year();i>=2019;i--){
             years.push(i)                                   
        }
        let pagination = <React.Fragment>
            <a href="#" onClick={this.toFirst} className={this.state.page===1?'disabled':''}><i className="fa fa-angle-double-left"></i></a>
            <a href="#" onClick={this.toPrevious} className={this.state.page===1?'disabled':''}><i className="fa fa-angle-left"></i></a>
            <a href="#" onClick={this.toNext} className={this.state.page===this.state.last_page?'disabled':''}><i className="fa fa-angle-right"></i></a>
            <a href="#" onClick={this.toEnd} className={this.state.page===this.state.last_page?'disabled':''}><i className="fa fa-angle-double-right"></i></a>
        </React.Fragment>

        return <div className="cardit-container vol-liste col-md-12">
            <div className="row clearfix align-items-stretch position-relative vol-container">
                <div className="col-12">
                    <div className="topContainer mb-2 d-flex justify-content-between align-items-center">
                        <div className="col-md-12">
                            <div className="align-items-baseline row">
                                {this.props.data.customer_type=='gsa'?<div className="col-md-2">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2">{trans('Airline')}</label>
                                        <select className="form-control" value={this.state.filter.airline_id} onChange={e=>this.onFilter(e, 'airline_id')}>
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.airlines.map(airline=><option key={`select-airline-${airline.id}`} value={airline.id}>{airline.name}</option>)}
                                        </select>
                                    </div>
                                </div>:null}
                                <div className="col-md-2 pr-md-0">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2">{trans('Origine')}</label>
                                        <select className="form-control" value={this.state.filter.handover_origin_location} onChange={e=>this.onFilter(e, 'handover_origin_location')} ref="origin">
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.select_origins.map(handover_origin_location=><option key={`select-handover-origin-location-${handover_origin_location.iata}`} value={handover_origin_location.iata}>{handover_origin_location.iata}</option>)}
                                        </select>
                                        <div className="m-auto">
                                            <i className="fa fa-2x mx-2 fa-caret-right"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5 border rounded p-2">
                                    <div className="d-flex">
                                        <label className="fancy-radio m-auto custom-color-green">
                                            <input name={`date-filter`} type="radio" value="date" onChange={this.handleDateChecked} checked={this.state.datefilter=='date'}/>
                                            <span><i className="mr-0"></i></span>
                                        </label>
                                        <div ref="datepicker" className="input-group date mx-2">
                                            <input type="text" className="form-control" defaultValue={moment(this.state.filter.prepared_at).format("DD/MM/YYYY")}/>
                                            <div className="input-group-append"> 
                                                <button className="btn-primary btn text-light" type="button"><i className="fa fa-calendar-alt"></i></button>
                                            </div>
                                        </div>
                                        <div className="form-group m-auto">
                                            <label className="control-label mx-2 mb-0">{trans('ou')}</label>
                                        </div>
                                        <label className="fancy-radio m-auto custom-color-green mx-2">
                                            <input name={`date-filter`} type="radio" value="year" onChange={this.handleYearChecked} checked={this.state.datefilter=='year'}/>
                                            <span><i className="mr-0"></i></span>
                                        </label>
                                        <select onChange={this.handleYearChange} className="form-control mx-2">
                                            {years.map(year=><option key={year} value={year}>{year}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2 text-nowrap">{trans("Nº d'expédition")}</label>
                                        <div className="input-group">
                                            <input ref="document_number" type="search" defaultValue={this.state.filter.document_number} className="form-control"/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={this.documentSearch}>{trans('OK')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="navPager d-flex align-items-center justify-content-end">
                            {this.nopaginate?null:pagination}
                        </div>
                    </div>
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="row m-0 justify-content-between">
                                <div className="filter d-flex align-items-center flex-wrap">
                                    <div>{trans('Nombre de cardits')} : <strong>{this.state.total}</strong></div>
                                    {this.nopaginate?null:<div className="form-group d-flex align-items-center justify-content-start flex-nowrap" style={{width:220}}>
                                        <label className="control-label">{trans('Voir')}</label>
                                        <select className="form-control" value={this.state.filter.perpage} onChange={e=>this.onFilter(e, 'perpage')}>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                        <label>{trans('par page')}</label>
                                    </div>}
                                </div>
                                {this.beforelist()}
                            </div>
                            <div className="card-bureau no-border p-0">
                                <div className="table-responsive">
                                    {this.table()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="navPager d-flex align-items-center justify-content-end">
                            {this.nopaginate?null:pagination}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

Modelizer(List)

class NavigableList extends List
{
    constructor(props) {
        super(props)
        this.state.data = this.props.data.data.data
        this.state.total = this.props.data.data.total
        this.state.last_page = this.props.data.data.last_page
        this.state.page = this.props.data.data.current_page ? this.props.data.data.current_page : 1
    }
}

export default NavigableList;