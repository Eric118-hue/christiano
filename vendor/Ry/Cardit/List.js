import React, {Component} from 'react';
import $ from 'jquery';
import moment from 'moment';
import swal from 'sweetalert2';
import {Popup, PopupHeader, PopupBody} from '../../bs/bootstrap';
import numeral from 'numeral';

class List extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            items : this.props.data.data.data,
            date : moment().format('YYYY-MM-DD'),
            filter : {
                prepared_at : moment(),
                airline_id : '',
                perpage : 25,
                handover_origin_location : '',
                document_number : '',
                handover_destination_location : '',
                conveyence_reference : ''
            }
        }
        this.table = this.table.bind(this)
        this.beforelist = this.beforelist.bind(this)
        this.onFilter = this.onFilter.bind(this)
        this.data = {
            json : true,
            s : {}
        }
        this.afterTd = this.afterTd.bind(this)
        this.afterTh = this.afterTh.bind(this)
        this.search = this.search.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckAll = this.handleCheckAll.bind(this)
        this.validateCardit = this.validateCardit.bind(this)
    }

    handleCheck(event, receptacle, cardit) {
        const value = event.target.checked
        this.setState(state=>{
            state.items.map(i_cardit=>{
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
            data : {...this.state.items.find(item=>item.id==cardit.id)},
            success : ()=>{
                $(`#receptacles-${cardit.id}`).modal('hide')
            }
        })
    }

    handleCheckAll(event, cardit) {
        const value = event.target.checked
        this.setState(state=>{
            state.items.map(i_cardit=>{
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
        this.setState(state=>{
            state.filter[field] = value
            return state
        })
        this.data.s[field] = value
        if(this.request) {
            this.request.abort()
        }
        this.request = $.ajax({
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.setState({
                    items : response.data.data
                })
            }
        })
    }

    beforelist() {

    }

    componentDidMount() {
        const opts = {
            //zIndexOffset : 100,
            language : 'fr',
            autoclose : true
        }
        const dp = $(this.refs.datepicker).datepicker(opts)
        dp.on("changeDate", ()=>{
            const date = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
            this.setState({
                date : date
            })
            this.data.s.prepared_at = date
            $.ajax({
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState({
                        items : response.data.data
                    })
                }
            })
        });
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='cardit') {
                if(storeState.row) {
                    this.setState(state=>{
                        state.items.push(storeState.row)
                        return state
                    })
                }
            }
        })
        $(this.refs.frm_receptacles).ajaxForm()
    }

    escales(cardit) {
        let k = cardit.nsetup.transports.length
        switch(k) {
            case 1:
                return <div>Direct</div>
            case 2:
                return <a className="btn btn-turquoise d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${cardit.id}`).modal('show')
                }}><span className="font-12">1 escale</span><i className="icon-pencil"></i></a>
            case 3:
                return <a className="btn btn-turquoise d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${cardit.id}`).modal('show')
                }}><span className="font-12">2 escales</span><i className="icon-pencil"></i></a>
            
        }
    }

    irregularites() {
        let k = Math.floor(3 * Math.random())
        switch(k) {
            case 0:
                return <a className="btn btn-danger d-flex justify-content-between pr-1 align-items-center" href="#" style={{width:100,height:34}}><span></span><span>NT</span> <i className="icon-pencil"></i></a>
            case 1:
                return <a className="btn d-flex text-white justify-content-between pr-1 align-items-center" href="#" style={{width:100,background:'#ff7c07',height:34}}><span></span><span>TP</span> <i className="icon-pencil"></i></a>
            case 2:
                return <a className="btn btn-success d-flex justify-content-between pr-1 align-items-center" href="#" style={{width:100,height:34}}><span></span><i className="fa fa-check text-white"></i><i className="fa fa-info-circle text-white"></i></a>
            
        }
    }

    performances() {
        let k = Math.floor(3 * Math.random())
        switch(k) {
            case 0:
                return <a className="btn btn-danger d-flex justify-content-between pr-1 align-items-center" href="#" style={{width:100,height:34}}><span></span><span>&gt; 24h</span><i className="icon-pencil"></i></a>
            case 1:
                return <a className="btn text-white d-flex justify-content-between pr-1 align-items-center" href="#" style={{width:100,background:'#ff7c07',height:34}}><span></span><span>&lt; 24h</span><i className="icon-pencil"></i></a>
            case 2:
                return <a className="btn btn-success d-flex justify-content-between pr-1 align-items-center" href="#" style={{width:100,height:34}}><span></span><i className="fa fa-check text-white"></i> <i className="fa fa-info-circle text-white"></i></a>
            
        }
    }

    completed() {
        let k = Math.floor(3 * Math.random())
        switch(k) {
            case 0:
                return <a className="btn btn-danger d-flex justify-content-between pr-1 align-items-center" href="#" style={{width:100,height:34}}><span></span><span>{Math.floor(100*Math.random())}</span><i className="icon-pencil"></i></a>
            case 1:
                return <a className="btn d-flex text-white justify-content-between pr-1 align-items-center" href="#" style={{width:100,background:'#ff7c07',height:34}}><span></span><span>{Math.floor(100*Math.random())}</span><i className="icon-pencil"></i></a>
            case 2:
                return <a className="btn btn-success text-white d-flex justify-content-between pr-1 align-items-center" href="#" style={{width:100,height:34}}><span></span><span>{Math.floor(100*Math.random())}</span><i className="fa fa-check text-white"></i> <i className="fa fa-info-circle text-white"></i></a>
            
        }
    }

    table() {
        return <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0"
        id="addrowExample">
            <thead>
                <tr>
                    <th>Emis le</th>
                    <th>à (hh:mm)</th>
                    <th>Nº d’expédition</th>
                    <th>Cat.</th>
                    <th>Classe</th>
                    <th>Nbr récipients</th>
                    <th>Poids (Kg)</th>
                    <th>Aéroport ORIG.</th>
                    <th>Direct/Escales</th>
                    <th>Aéroport DEST.</th>
                    <th>Premier vol</th>
                    <th style={{width:107}}>Irrégularités</th>
                    <th style={{width:107}}>Performances</th>
                    <th style={{width:107}}>Trip completed</th>
                    {this.afterTh()}
                </tr>
            </thead>
            <tbody>
                {this.state.items.map(item=><tr key={`cardit-${item.id}`} className="gradeA">
                    <td>{moment.utc(item.nsetup.preparation_datetime).format('DD/MM/YYYY')}</td>
                    <td>{moment.utc(item.nsetup.preparation_datetime).format('HH:mm')}</td>
                    <td className="actions">{item.nsetup.document_number} <a href="#" className="btn-sm btn-icon btn-pure btn-turquoise on-default ml-2 m-r-5 button-edit" onClick={e=>{
                        e.preventDefault()
                        $(`#receptacles-${item.id}`).modal('show')
                    }}>
                        <i className="icon-pencil" aria-hidden="true"></i></a>
                        <Popup id={`receptacles-${item.id}`} className="modal-xl">
                            <PopupHeader className="bg-info text-light">
                                <h4>Liste des récipients - Expédition {item.nsetup.document_number}</h4>
                            </PopupHeader>
                            <PopupBody>
                                <div className="col-md-12">
                                    <table className="table table-bordered table-centerall">
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Numéro du récipient</th>
                                                <th>Flag <i className="fa fa-info-circle"></i></th>
                                                <th>Container Journey ID</th>
                                                <th>Type de récipient</th>
                                                <th>Poids (Kg)</th>
                                                <th>
                                                    <div className="fancy-checkbox">
                                                        <label>
                                                            <input name={`checkbox${item}`} type="checkbox" value="1" checked={item.selected===true} onChange={e=>this.handleCheckAll(e, item)}/>
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.receptacles.map((receptacle, index)=><tr key={`content-${receptacle.id}`}>
                                                <td>{numeral(index+1).format('00')}</td>
                                                <td>{receptacle.id}</td>
                                                <td>{receptacle.nsetup.handling}</td>
                                                <td>{receptacle.nsetup.nesting}</td>
                                                <td>{receptacle.nsetup.type.interpretation}</td>
                                                <td>{receptacle.nsetup.weight}</td>
                                                <td>
                                                    <div className="fancy-checkbox">
                                                        <label>
                                                            <input name={`receptacles[${receptacle.id}]`} type="checkbox" value="1" checked={receptacle.selected===true} onChange={e=>this.handleCheck(e, receptacle, item)}/>
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>)}
                                        </tbody>
                                    </table>
                                    <input type="hidden" name="ry"/>
                                    <button className="float-right btn btn-orange" type="button" onClick={()=>this.validateCardit(item)}>Validation</button>
                                </div>
                            </PopupBody>
                        </Popup>            
                    </td>
                    <td>{item.nsetup.consignment_category.code}</td>
                    <td>{item.nsetup.mail_class.code}</td>
                    <td>{item.nsetup.nreceptacles}</td>
                    <td>{item.nsetup.wreceptacles} Kg</td>
                    <td>{item.nsetup.handover_origin_location.iata} <a href="#" onClick={e=>{
                        e.preventDefault()
                        swal(item.nsetup.handover_origin_location.name)
                    }}><i className="fa fa-info-circle text-turquoise"></i></a></td>
                    <td>{this.escales(item)}
                        <Popup id={`escales-${item.id}`}>
                            <PopupHeader>
                                Escales
                            </PopupHeader>
                            <PopupBody>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Aéroport</th>
                                            <th>Arrivée</th>
                                            <th>Départ</th>
                                            <th>Vol</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.nsetup.transports.slice(0, -1).map((transport, index)=><tr key={`escale-${item.id}-${index}`}>
                                            <td>{transport.arrival_location.iata} - {transport.arrival_location.name} - {transport.arrival_location.country.nom}</td>
                                            <td>{moment.utc(transport.arrival_datetime).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{moment.utc(item.nsetup.transports[index+1].departure_datetime).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{transport.conveyence_reference}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </PopupBody>
                        </Popup>
                    </td>
                    <td>{item.nsetup.handover_destination_location.iata} <a href="#" onClick={e=>{
                        e.preventDefault()
                        swal(item.nsetup.handover_destination_location.name)
                    }}><i className="fa fa-info-circle text-turquoise"></i></a></td>
                    <td>{item.nsetup.transports[0].conveyence_reference} <a href="#" onClick={e=>{
                        e.preventDefault()
                        swal(item.nsetup.transports[0].airlines.join('<br/>'))
                    }}><i className="fa fa-info-circle text-turquoise"></i></a></td>
                    <td>{this.irregularites()}</td>
                    <td>{this.performances()}</td>
                    <td>{this.completed()}</td>
                    {this.afterTd(item)}
                </tr>)}
            </tbody>
        </table>
    }

    render() {
        return <div className="cardit-container vol-liste col-md-12">
            <div className="row clearfix align-items-stretch position-relative vol-container">
                <div className="col-12">
                    <div className="topContainer d-flex justify-content-between align-items-center">
                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-md-6">
                                    <div ref="datepicker" className="input-group date">
                                        <input type="text" className="form-control" defaultValue={moment(this.state.filter.prepared_at).format("DD/MM/YYYY")}/>
                                        <div className="input-group-append"> 
                                            <button className="btn-primary btn text-light" type="button"><i className="fa fa-calendar-alt"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group ml-2" style={{width:300}}>
                                        <select className="form-control" value={this.state.filter.airline_id} onChange={e=>this.onFilter(e, 'airline_id')}>
                                            <option value="">Tous</option>
                                            {this.props.data.airlines.map(airline=><option key={`select-airline-${airline.id}`} value={airline.id}>{airline.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="navPager d-flex align-items-center justify-content-end">
                            <a href="#"><i className="fa fa-angle-double-left"></i></a>
                            <a href="#"><i className="fa fa-angle-left"></i></a>
                            <a href="#"><i className="fa fa-angle-right"></i></a>
                            <a href="#"><i className="fa fa-angle-double-right"></i></a>
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-header">
                            Search
                        </div>
                        <div className="body">
                            <div className="row">
                                <div className="col-md-3 form-group">
                                    <label className="control-label">Nº d’expédition</label>
                                    <input type="search" value={this.state.filter.document_number} onChange={e=>this.handleFilter(e, 'document_number')} className="form-control"/>
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="control-label">Aéroport ORIG.</label>
                                    <input type="search" value={this.state.filter.handover_origin_location} onChange={e=>this.handleFilter(e, 'handover_origin_location')} className="form-control"/>
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="control-label">Aéroport DEST.</label>
                                    <input type="search" value={this.state.filter.handover_destination_location} onChange={e=>this.handleFilter(e, 'handover_destination_location')} className="form-control"/>
                                </div>
                                <div className="col-md-2 form-group">
                                    <label className="control-label">N° de vol</label>
                                    <input type="search" value={this.state.filter.conveyence_reference} onChange={e=>this.handleFilter(e, 'conveyence_reference')} className="form-control"/>
                                </div>
                                <div className="col-md-1 form-group">
                                    <button type="button" className="btn btn-orange mt-4" onClick={this.search}>Filtrer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="row m-0 justify-content-between">
                                <div className="filter d-flex align-items-center flex-wrap">
                                    <div className="form-group d-flex align-items-center justify-content-start flex-nowrap" style={{width:220}}>
                                        <label className="control-label">Show</label>
                                        <select className="form-control" value={this.state.filter.perpage} onChange={e=>this.onFilter(e, 'perpage')}>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                        <label>entries</label>
                                    </div>
                                </div>
                                {this.beforelist()}
                            </div>
                            <div className="card-bureau no-border">
                                <div className="table-responsive">
                                    {this.table()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="navPager d-flex align-items-center justify-content-end">
                            <a href="#"><i className="fa fa-angle-double-left"></i></a>
                            <a href="#"><i className="fa fa-angle-left"></i></a>
                            <a href="#"><i className="fa fa-angle-right"></i></a>
                            <a href="#"><i className="fa fa-angle-double-right"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default List;