import React from 'react';
import trans from '../../translations';
import Cardit from './Item';
import NavigableModel from 'ryvendor/Ry/Core/NavigableModel';
import $ from 'jquery';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from 'ryvendor/bs/bootstrap';
import numeral from 'numeral';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import swal from 'sweetalert2';
import './List.scss';

Array.prototype.groupBy = function(fn){
    let ar = []
    let subar = []
    this.map(it=>{
        let i = fn(it)
        if(ar.indexOf(i)<0)
            ar.push(fn(it))
    })
    ar.map(a=>subar.push(this.filter(it=>fn(it)==a)))
    return subar
}

class List2 extends NavigableModel
{
    constructor(props) {
        super(props)
        this.endpoint = '/cardits/exports'
        this.model = 'cardit'
        this.nopaginate = true
        this.readOnly = false
        this.state.date = moment().format('YYYY-MM-DD')
        this.state.datefilter = this.models('props.data.filter.prepared_at_year') ? 'year' : 'date'
        this.state.nreceptacles = 0
        this.state.errors = []
        this.state.filter = {
            prepared_at : this.models('props.data.filter.prepared_at', moment()),
            to_prepared_at : this.models('props.data.filter.to_prepared_at', moment()),
            prepared_at_year : this.models('props.data.filter.prepared_at_year', moment().year()),
            airline_id : '',
            handover_origin_location : this.models('props.data.filter.handover_origin_location', ''),
            document_number : this.models('props.data.filter.document_number', ''),
            receptacle_id : this.models('props.data.filter.receptacle_id', ''),
            lta_number : this.models('props.data.filter.lta_number', ''),
            handover_destination_location : this.models('props.data.filter.handover_destination_location', '')
            //conveyence_reference : ''
        }
        this.xhrdata = {...this.state.filter}
        this.xhrdata.prepared_at = moment(this.xhrdata.prepared_at).format('YYYY-MM-DD')
        this.xhrdata.to_prepared_at = moment(this.xhrdata.to_prepared_at).format('YYYY-MM-DD')
        this.table = this.table.bind(this)
        this.beforelist = this.beforelist.bind(this)
        this.onFilter = this.onFilter.bind(this)
        let criterias = this.models('props.data.filter', {})
        this.data = {
            json : true,
            s : Array.isArray(criterias) ? {
                to_prepared_at : moment().format('YYYY-MM-DD')
            } : criterias 
        }
        this.afterTd = this.afterTd.bind(this)
        this.afterTh = this.afterTh.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckAll = this.handleCheckAll.bind(this)
        this.validateCardit = this.validateCardit.bind(this)
        this.documentSearch = this.documentSearch.bind(this)
        this.receptacleSearch = this.receptacleSearch.bind(this)
        this.handleDateChecked = this.handleDateChecked.bind(this)
        this.handleYearChecked = this.handleYearChecked.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
        this.ltaSearch = this.ltaSearch.bind(this)
        this.reception = this.reception.bind(this)
        this.handleToPreparedAtChange = this.handleToPreparedAtChange.bind(this)
    }

    ltaSearch() {
        const field = 'lta_number'
        const value = this.refs.lta_number.value
        if(this.pxhr)
            this.pxhr.abort()
        if(!/^\d{8}$/.test(value)) {
            swal(
                trans('LTA erron??'),
                trans("Ce N?? de LTA n???existe pas"),
                'error'
            )
            this.setState({
                errors : ['lta_number']
            })
            return
        }
        this.setState(state=>{
            state.filter.lta_number = value
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s[field] = value
        delete this.data.s.prepared_at
        delete this.data.s.to_prepared_at
        delete this.data.s.prepared_at_year
        delete this.data.s.handover_origin_location
        delete this.data.s.handover_destination_location
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

    handleYearChecked(event) {
        const value = event.target.value
        if(event.target.checked) {
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.data = []
                state.datefilter = value
                state.filter.document_number = ''
                state.filter.receptacle_id = ''
                state.filter.lta_number = ''
                state.total = 0
                return state
            })
            this.urls = []
            this.data.s = {...this.state.filter}
            delete this.data.s.prepared_at
            delete this.data.s.to_prepared_at
            delete this.data.s.document_number
            delete this.data.s.lta_number
            delete this.data.s.receptacle_id
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
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
                        state.page = response.data.current_page
                        return state
                    })
                    window.setTimeout(this.progress, 100)
                }
            })
        }
    }

    handleToPreparedAtChange(e) {
        const value = e.target.value
        this.setState(state=>{
            state.filter.to_prepared_at = value
            return state
        })
    }

    handleDateChecked(event) {
        const value = event.target.value
        if(event.target.checked) {
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.data = []
                state.datefilter = value
                state.total = 0
                state.filter.document_number = ''
                state.filter.receptacle_id = ''
                return state
            })
            this.urls = []
            this.data.s = {...this.state.filter}
            if(this.data.s.prepared_at)
                this.data.s.prepared_at = moment(this.data.s.prepared_at).format('YYYY-MM-DD')
            if(this.data.s.to_prepared_at)
                this.data.s.to_prepared_at = moment(this.data.s.to_prepared_at).format('YYYY-MM-DD')
            delete this.data.s.document_number
            delete this.data.s.lta_number
            delete this.data.s.prepared_at_year
            delete this.data.s.receptacle_id
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
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
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
            state.filter.document_number = ''
            state.filter.lta_number = ''
            state.filter.receptacle_id = ''
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
            delete this.data.s.to_prepared_at
            delete this.data.s.document_number
            delete this.data.s.lta_number
            delete this.data.s.receptacle_id
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
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
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

    afterTd(cardit) {

    }

    afterTh() {

    }

    onFilter(event, field) {
        const value = event.target.value
        if(this.pxhr)
            this.pxhr.abort()
        this.setState(state=>{
            state.filter.document_number = ''
            state.filter.receptacle_id = ''
            state.filter.lta_number = ''
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
        if(this.state.datefilter=='date' && this.data.s.to_prepared_at)
            this.data.s.to_prepared_at = moment(this.data.s.to_prepared_at).format('YYYY-MM-DD')
        delete this.data.s.document_number
        delete this.data.s.lta_number
        delete this.data.s.receptacle_id
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
                    state.data = response.data.data
                    state.last_page = response.data.last_page
                    state.page = response.data.current_page
                    let total_weight = 0
                    let nreceptacles = 0
                    state.data.map(item=>{
                        total_weight += parseFloat(item.nsetup.wreceptacles)
                        nreceptacles += parseInt(item.nsetup.nreceptacles)
                    })
                    state.total_weight = total_weight
                    state.nreceptacles = nreceptacles
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
        const dp_to = $(this.refs.datepicker_to).datepicker(opts)
        dp.on("changeDate", ()=>{
            if(this.state.datefilter!='date')
                return

            const date = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.filter.prepared_at = date
                state.filter.receptacle_id = ''
                state.filter.document_number = ''
                state.filter.lta_number = ''
                state.date = date
                state.data = []
                state.total = 0
                return state
            })
            this.urls = []
            this.data.s.prepared_at = date
            delete this.data.s.prepared_at_year
            delete this.data.s.receptacle_id
            delete this.data.s.document_number
            delete this.data.s.lta_number
            $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
                        state.total = response.data.total
                        return state
                    })
                    window.setTimeout(this.progress, 1)
                }
            })
        });
        dp_to.on("changeDate", ()=>{
            if(this.state.datefilter!='date')
                return

            const date = moment(dp_to.datepicker('getDate')).format('YYYY-MM-DD')
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.filter.to_prepared_at = date
                state.filter.receptacle_id = ''
                state.filter.document_number = ''
                state.filter.lta_number = ''
                state.date = date
                state.data = []
                state.total = 0
                return state
            })
            this.urls = []
            this.data.s.to_prepared_at = date
            delete this.data.s.prepared_at_year
            delete this.data.s.receptacle_id
            delete this.data.s.document_number
            delete this.data.s.lta_number
            $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
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
                    let total_weight=0;
                    let nreceptacles = 0
                    state.data.map(item=>{
                        total_weight += parseFloat(item.nsetup.wreceptacles)
                        nreceptacles += parseInt(item.nsetup.nreceptacles)
                    })
                    state.total_weight = total_weight
                    state.nreceptacles = nreceptacles
                    return state
                })
            }
        })
    }

    onProgress(state) {
        let total_weight=0;
        let nreceptacles=0;
        state.data.map(item=>{
            total_weight += parseFloat(item.nsetup.wreceptacles)
            nreceptacles += parseInt(item.nsetup.nreceptacles)
        })
        state.total_weight = total_weight
        state.nreceptacles = nreceptacles
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
        delete this.data.s.to_prepared_at
        delete this.data.s.prepared_at_year
        delete this.data.s.handover_origin_location
        delete this.data.s.handover_destination_location
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

    receptacleSearch() {
        const field = 'receptacle_id'
        const value = this.refs.receptacle_id.value
        if(this.pxhr)
            this.pxhr.abort()
        this.setState(state=>{
            state.filter.receptacle_id = value
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s[field] = value
        delete this.data.s.prepared_at
        delete this.data.s.to_prepared_at
        delete this.data.s.prepared_at_year
        delete this.data.s.handover_origin_location
        delete this.data.s.handover_destination_location
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
        cardit.receptacles.map(receptacle=>{
            if(this.cast(receptacle, 'nsetup.poc.value')) {
                k = 1
            }
        })
        switch(k) {
            case 0:
                return <a className={`align-items-center badge badge-orange border-0`} href="#" style={{height:20,width:20}}><span></span><span></span></a>
            case 5:
                return <a className="align-items-center cursor-default badge badge-theme border-0 text-white" href="#" style={{height:20,width:20}}>AMD</a>
            case 3:
                return <a className="align-items-center cursor-default badge badge-turquoise border-0 text-white" href="#" style={{height:20,width:20}}><span></span></a>
            case 4:
                return <a className="align-items-center cursor-default badge badge-army border-0 text-white" href="#" style={{height:20,width:20}}>IFTSTA</a>
            case 1:
                return <a className={`align-items-center badge badge-turquoise border-0`} href="#" style={{height:20,width:20}}><span></span></a>   
        }
    }

    table() {
        return <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0"
        id="addrowExample">
            <thead>
                <tr>
                    <th>{trans('Emis le')}</th>
                    <th>{trans('??')}</th>
                    <th>{trans("N?? d'exp??dition")}</th>
                    <th>{trans('Cat.')}</th>
                    <th>{trans('Clas.')}</th>
                    <th>{trans('Qt??')}</th>
                    <th>{trans('Poids')}</th>
                    <th>{trans('Orig.')}</th>
                    <th>{trans('Escale')}</th>
                    <th>{trans('Dest.')}</th>
                    <th>{trans('N?? de vol')}</th>
                    <th style={{width:104}}>{trans('Irr??gularit??s')}</th>
                    <th style={{width:104}}>{trans('Performances')}</th>
                    <th style={{width:104}}>{trans('Trip completed')}</th>
                    {this.afterTh()}
                </tr>
            </thead>
            <tbody>
                {this.state.data.map(item=><tr key={`cardit-${item.id}`} className="gradeA">
                    <td>{moment.utc(item.nsetup.preparation_datetime).local().format('DD/MM/YYYY')}</td>
                    <td>{moment(item.nsetup.preparation_datetime_lt).format('HH:mm')}</td>
                    <td className="actions"><a href={`#dialog/cardit_file?id=${item.id}`}><i className="icon-info"></i></a><span className="d-inline-block px-2 list-document-number">{item.nsetup.document_number}</span><a href="#" className="btn-sm btn-icon btn-pure btn-turquoise on-default ml-2 m-r-5 button-edit" onClick={e=>{
                        e.preventDefault()
                        $(`#receptacles-${item.id}`).modal('show')
                    }}>
                        <i className="icon-pencil" aria-hidden="true"></i></a>
                        <Popup id={`receptacles-${item.id}`} className="modal-xl">
                            <PopupHeader className="bg-info text-light">
                                <h4>{trans('Liste des r??cipients')} - {trans('Exp??dition')} {item.nsetup.document_number}</h4>
                            </PopupHeader>
                            <PopupBody>
                                <div className="col-md-12">
                                    <table className="table table-bordered table-centerall">
                                        <thead>
                                            <tr>
                                                <th>{trans('N??')}</th>
                                                <th>{trans('Num??ro du r??cipient')}</th>
                                                <th>{trans('Flag')} <i className="fa fa-info-circle"></i></th>
                                                <th>{trans('Container Journey ID')}</th>
                                                <th>{trans('Type de r??cipient')}</th>
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
                    <td>{numeral(item.nsetup.wreceptacles).format('0,0.00')}</td>
                    <td>{item.nsetup.handover_origin_location.iata} <a href="#" onClick={e=>{
                        e.preventDefault()
                        $(`#origin-${item.id}`).modal('show')
                    }}><i className="fa fa-info-circle text-turquoise"></i></a>
                        <Popup id={`origin-${item.id}`} className="airport-modal">
                            <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans("A??roport d'origine")}</span></h5>
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
                                        {trans('A??roport')} :
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
                                            <th>{trans('A??roport')}</th>
                                            <th>{trans('Arriv??e')}</th>
                                            <th>{trans('D??part')}</th>
                                            <th>{trans('Vol')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.transports.slice(0, -1).map((transport, index)=><tr key={`escale-${item.id}-${index}`}>
                                            <td>{transport.arrival_location.iata} - {transport.arrival_location.name} - {transport.arrival_location.country.nom}</td>
                                            <td>{moment(transport.arrival_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{moment(item.transports[index+1].departure_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{item.transports[index+1].conveyence_reference}</td>
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
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('A??roport de destination')}</span></h5>
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
                                        {trans('A??roport')} :
                                    </div>
                                    <div className="col-7 text-left text-wrap">
                                        {item.nsetup.handover_destination_location.name}
                                    </div>
                                </div>
                            </PopupBody>
                        </Popup>
                    </td>
                    <td>{item.transports[0].conveyence_reference} <a href="#" onClick={e=>{
                        e.preventDefault()
                        $(`#conveyence-${item.id}`).modal('show')
                    }}><i className="fa fa-info-circle text-turquoise"></i></a>
                        <Popup id={`conveyence-${item.id}`} className="airport-modal">
                            <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('Premier vol')}</span></h5>
                            </PopupHeader>
                            <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                            <PopupBody>
                                {item.transports[0].airlines.join('<br/>')}
                            </PopupBody>
                        </Popup>
                    </td>
                    <td>{moment(this.models('props.data.transports.0.departure_datetime_lt')).format('DD/MM/YYYY')}</td>
                    <td>{moment(this.models('props.data.transports.0.departure_datetime_lt')).format('HH:mm')}</td>
                    <td>{this.reception(item)}</td>
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
                                <div className="col-md-2">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2">{trans('Airline')}</label>
                                        <select className="form-control" value={this.state.filter.airline_id} onChange={e=>this.onFilter(e, 'airline_id')}>
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.airlines.map(airline=><option key={`select-airline-${airline.id}`} value={airline.id}>{airline.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={`col-md-2`}>
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2">{trans('Origine')}</label>
                                        <select className="form-control" value={this.state.filter.handover_origin_location} onChange={e=>this.onFilter(e, 'handover_origin_location')} ref="origin">
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.select_origins.map(handover_origin_location=><option key={`select-handover-origin-location-${handover_origin_location.iata}`} value={handover_origin_location.iata}>{handover_origin_location.iata}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={`col-md-2`}>
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2">{trans('Dest.')}</label>
                                        <select className="form-control" value={this.state.filter.handover_destination_location} onChange={e=>this.onFilter(e, 'handover_destination_location')} ref="destination">
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.select_destinations.map(handover_destination_location=><option key={`select-handover-destination-location-${handover_destination_location.iata}`} value={handover_destination_location.iata}>{handover_destination_location.iata}</option>)}
                                        </select>
                                        <div className="m-auto">
                                            <i className="fa fa-2x mx-2 fa-caret-right"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 border rounded p-2">
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
                                            <label className="control-label mx-2 mb-0">{trans('au')}</label>
                                        </div>
                                        <div ref="datepicker_to" className="input-group date mx-2">
                                            <input type="text" className="form-control" value={moment(this.state.filter.to_prepared_at).format("DD/MM/YYYY")} onChange={this.handleToPreparedAtChange}/>
                                            <div className="input-group-append"> 
                                                <button className="btn-primary btn text-light" type="button"><i className="fa fa-calendar-alt"></i></button>
                                            </div>
                                        </div>
                                        <div className="form-group m-auto">
                                            <label className="control-label ml-5 mr-2 mb-0">{trans('ou')}</label>
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
                            </div>
                            <div className="align-items-baseline row">
                                <div className="col-md-3">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="document_number" type="search" placeholder={trans("N?? d'exp??dition")} value={this.state.filter.document_number} className="form-control" onChange={e=>{
                                                const value = e.target.value
                                                this.setState(state=>{
                                                    state.filter.document_number = value
                                                    return state
                                                })
                                            }}/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={this.documentSearch}>{trans('OK')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="receptacle_id" placeholder={trans("N?? de r??cipient")} type="search" value={this.state.filter.receptacle_id} className="form-control" onChange={e=>{
                                                const value = e.target.value
                                                this.setState(state=>{
                                                    return state.filter.receptacle_id = value
                                                })
                                            }}/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={this.receptacleSearch}>{trans('OK')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 offset-md-3">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="lta_number" type="search" placeholder={trans("Rechercher un N?? LTA")} value={this.state.filter.lta_number} className={`form-control ${this.state.errors.indexOf('lta_number')>=0?'parsley-error':''}`} onChange={e=>{
                                                const value = e.target.value
                                                this.setState(state=>{
                                                    state.errors = []
                                                    state.filter.lta_number = value
                                                    return state
                                                })
                                            }}/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={this.ltaSearch}>{trans('OK')}</button>
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
                                <h4>{trans('RECEPTIONS EXPORT')}</h4>
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

Modelizer(List2)

class List1 extends List2
{
    constructor(props) {
        super(props)
        this.state.data = this.props.data.data.data
        this.state.total = this.props.data.data.total
        let total_weight = 0
        let nreceptacles = 0
        this.state.data.map(item=>{
            nreceptacles += parseInt(item.nsetup.nreceptacles)
            total_weight += parseFloat(item.nsetup.wreceptacles)
        })
        this.state.total_weight = total_weight
        this.state.nreceptacles = nreceptacles
        this.state.last_page = this.props.data.data.last_page
        this.state.page = this.props.data.data.current_page ? this.props.data.data.current_page : 1
    }
}

class List0 extends List1
{
    constructor(props) {
        super(props)
        this.progressive = true
        this.state.awbs = []
        this.state.nawbs = 0
        this.state.wawbs = 0
        this.state.prefix = ''
        this.state.code = ''
        this.state.cover = true
        this.removeAwb = this.removeAwb.bind(this)
        this.cancelAwbs = this.cancelAwbs.bind(this)
        this.handleNawbsChange = this.handleNawbsChange.bind(this)
        this.handleWawbsChange = this.handleWawbsChange.bind(this)
        this.handleCode = this.handleCode.bind(this)
        this.handlePrefix = this.handlePrefix.bind(this)
    }

    handlePrefix(e) {
        const prefix = e.target.value
        if(/^\d{0,3}$/.test(prefix)) {
            this.setState({
                prefix
            })
        }
    }

    handleCode(e) {
        const code = e.target.value
        if(/^\d{0,8}$/.test(code)) {
            this.setState({
                code
            })
        }
    }

    handleNawbsChange(e) {
        const nawbs = e.target.value
        this.setState({
            nawbs
        })
    }

    handleWawbsChange(e) {
        const wawbs = e.target.value
        this.setState({
            wawbs
        })
    }

    componentDidMount() {
        super.componentDidMount()
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type==='awbs') {
                setTimeout(()=>{
                    document.location.reload()
                }, 1000)
            }
            if(storeState.type==='insert_awb') {
                this.setState(state=>{
                    if(state.awbs.length==0 || (state.awbs.length>0 && state.awbs[0].nsetup.handover_destination_location.id==storeState.cardit.nsetup.handover_destination_location.id)) {
                        state.awbs.push(storeState.cardit)
                        state.cover = this.cast(storeState.cardit, 'provenance.endpoint.owner.nsetup.cover') == 1
                        state.nawbs = 0
                        state.wawbs = 0
                        state.awbs.map(awb=>{
                            state.nawbs += parseInt(awb.nsetup.nreceptacles)
                            state.wawbs += parseFloat(awb.nsetup.wreceptacles)
                        })
                        state.wawbs = state.wawbs.toFixed(2)
                    }
                    return state
                })
            }
            else if(storeState.type==='delete_awb') {
                this.setState(state=>{
                    state.awbs = state.awbs.filter(it=>it.id!=storeState.cardit.id)
                    state.nawbs = 0
                    state.wawbs = 0
                    state.awbs.map(awb=>{
                        state.nawbs += parseInt(awb.nsetup.nreceptacles)
                        state.wawbs += parseFloat(awb.nsetup.wreceptacles)
                    })
                    state.wawbs = state.wawbs.toFixed(2)
                    return state
                })
            }
        })
    }

    removeAwb(awb) {
        this.props.store.dispatch({
            type: 'delete_awb',
            cardit: awb
        })
    }

    cancelAwbs() {
        this.state.awbs.map(awb=>{
            this.props.store.dispatch({
                type: 'delete_awb',
                cardit: awb
            })
        })
    }

    table() {
        return <React.Fragment>
            <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0" cellPadding="0" id="recipientTable">
                <thead>
                    <tr>
                        <th>{trans('Emis le')}</th>
                        <th>{trans('??')}</th>
                        <th colSpan={3}>{trans('N?? d???exp??dition')}</th>
                        <th>{trans('Cat.')}</th>
                        <th>{trans('Clas.')}</th>
                        <th>{trans('Qt??')}</th>
                        <th>{trans('Poids')}</th>
                        <th>{trans('Orig.')}</th>
                        <th>{trans('Escale')}</th>
                        <th>{trans('Dest.')}</th>
                        <th>{trans('N?? de vol')}</th>
                        <th>{trans('D??part pr??vu le')}</th>
                        <th>{trans('??')}</th>
                        <th>{trans('REC')}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.groupBy(it=>`${this.cast(it, 'lta_id', 'cardit'+it.id)}`).map((group, groupIndex)=>{
                        let wreceptacles = 0
                        let nreceptacles = 0
                        group.map(item=>{
                            wreceptacles += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        return group.map((item, index)=><Cardit bg={`bg${groupIndex%2?1:2}`} destFocus={this.models('state.awbs.0.nsetup.handover_destination_location.id')} readOnly={this.readOnly} escales={this.escales} data={item} reception={this.reception} consignmentEvents={this.props.data.consignment_events} deliveryConsignmentEvents={this.props.data.delivery_consignment_events} store={this.props.store} wreceptacles={wreceptacles} nreceptacles={nreceptacles} pindex={index} nrows={group.length} key={`cardit-group-${item.id}`} group={`cardit-group-${this.cast(item, 'lta_id')}`}/>)
                    })}
                </tbody>
                <tfoot className={(this.progressive && this.state.page<this.state.last_page)?'':'d-none'}>
                    <tr>
                        <td ref="overscroller" colSpan="16" className={`position-relative py-3`}><i className="spinner"></i></td>
                    </tr>
                </tfoot>
            </table>
            <form action={`/awb`} method="post" className={`awbs border border-turquoise m-5 p-3 position-fixed rounded ${this.state.awbs.length>0?'':'d-none'}`}>
                <input type="hidden" name="ry"/>
                <div className='text-center'><strong>{trans("Assemblage des num??ros d'exp??dition sur une AWB")}</strong></div>
                <div className='awbs-content'>
                    {this.state.awbs.map(awb=><div key={`awbed-${awb.id}`} onClick={()=>this.removeAwb(awb)} role="button" className='d-flex justify-content-between align-items-center border-bottom py-2'>
                        <span>{awb.nsetup.document_number}</span>
                        <span className="text-turquoise"><i className='fa fa-square-full'></i></span>
                        <input type='hidden' name={`cardits[]`} value={awb.id}/>
                    </div>)}
                </div>
                <div className="input-group mt-2">
                    <input type="number" aria-label="prefix" required data-parsley-errors-container="#awb-errors" data-parsley-required-message={trans('Le pr??fixe est obligatoire')} data-parsley-pattern="\d{3}" data-parsley-pattern-message={trans("Le pr??fixe doit comporter 3 chiffres")} className="form-control" name="prefix" placeholder={trans('Pr??fixe')} value={this.state.prefix} onChange={this.handlePrefix}/>
                    <input type="number" aria-label="code" required data-parsley-errors-container="#awb-errors" data-parsley-required-message={trans('Le N?? AWB est obligatoire')} data-parsley-pattern="\d{8}" data-parsley-pattern-message={trans("Le N?? de LTA doit comporter 8 chiffres")} className="form-control" name="code" placeholder={trans('N?? AWB')} value={this.state.code} onChange={this.handleCode}/>
                </div>
                <div id="awb-errors"></div>
                <div className="input-group my-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text font-10">{trans('Qt??')}</div>
                    </div>
                    <input type="number" className="form-control" required name="nsetup[nreceptacles]" value={this.state.nawbs} onChange={this.handleNawbsChange}/>
                    <div className="input-group-prepend">
                        <div className="input-group-text font-10">{trans('Poids')}</div>
                    </div>
                    <input type="number" className="form-control" required name="nsetup[wreceptacles]" value={this.state.wawbs} onChange={this.handleWawbsChange}/>
                </div>
                <div className='btn-group w-100'>
                    <button className='btn btn-grey text-light' type='button' onClick={this.cancelAwbs}>{trans('Annuler')}</button>
                    <button className='btn btn-turquoise text-light'>{trans('Confirmer')}</button>
                </div>
            </form>
        </React.Fragment>
    }
}

class List extends List0
{
    constructor(props) {
        super(props)
        this.readOnly = true
    }

    afterTh() {
        return <th></th>
    }

    afterTd(cardit) {
        return <td>
            <a href={`/cardit_delete?id=${cardit.id}`} className="btn btn-danger">{trans('Supprimer')}</a>
        </td>
    }
}

export default List;