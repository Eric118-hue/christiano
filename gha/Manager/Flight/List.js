import React from 'react';
import BaseList from '../../../vendor/Ry/Airline/Cardit/List';
import trans from '../../translations';
import Flight from './Item';
import moment from 'moment';
import $ from 'jquery';
import Datepicker from 'ryvendor/bs/Datepicker';
import swal from 'sweetalert2';

class List extends BaseList
{
    constructor(props) {
        super(props)
        this.model = 'flight'
        this.endpoint = '/flights'
        this.readOnly = (this.props.data.user.guard=='manager')
        this.state.t = moment()
        this.containerSearch = this.containerSearch.bind(this)
        this.state.filter.container_id = this.models('props.data.filter.container_id', '')
        this.state.filter.departure_datetime_lt = this.models('props.data.filter.departure_datetime_lt', moment())
        this.state.filter.conveyence_reference = this.models('props.data.filter.conveyence_reference')
        this.handleClearFilter = this.handleClearFilter.bind(this)
        this.archive = this.archive.bind(this)
    }

    archive(item) {
        swal({
            title: trans('Confirmez-vous l\'archivage?'),
            text: trans('Cet enregistrement sera archivé'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme')
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: 'put',
                    url : '/flight',
                    data : {
                        id : item.id
                    },
                    success : ()=>{
                        this.setState(state=>{
                            state.data = state.data.filter(it=>it.id!=item.id)
                            return state
                        })
                    }
                })
                
            }
        })
    }

    handleClearFilter() {
        if(this.request) {
            this.request.abort()
        }
        this.setState({
            filter : {
                departure_datetime_lt : moment()
            },
            t : moment()
        })
        this.data.s = {}
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

    containerSearch() {
        const field = 'container_id'
        const value = this.refs.container_id.value
        if(this.pxhr)
            this.pxhr.abort()
        this.setState(state=>{
            state.filter.container_id = value
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s[field] = value
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

    table() {
        return <table className="table table-bordered table-hover table-striped table-liste mail-manifest" cellSpacing="0" cellPadding="0">
            <thead>
                <tr>
                    <th>{trans('Créé le')}</th>
                    <th>{trans('N° de conteneur')}</th>
                    <th>{trans('Nb sacs')}</th>
                    <th>{trans('Poids net')}</th>
                    <th>{trans('Tare')}</th>
                    <th>{trans('Nº de vol')}</th>
                    <th>{trans('Date de départ')}</th>
                    <th>{trans('Origine')}</th>
                    <th>{trans('Destination')}</th>
                    <th>{trans('Manifest')}</th>
                    <th>{trans('Archive')}</th>
                    <th>{trans('Edition')}</th>
                </tr>
            </thead>
            <tbody>
                {this.state.data.map(item=><Flight archive={()=>this.archive(item)} readOnly={this.readOnly} key={`mail-manifest-${item.id}`} escales={this.escales} data={item} reception={this.reception} assignation={this.assignation} completed={this.completed} consignmentEvents={this.props.data.consignment_events} deliveryConsignmentEvents={this.props.data.delivery_consignment_events} store={this.props.store} theme={this.props.data.theme}/>)}
            </tbody>
            <tfoot className={(this.progressive && this.state.page<this.state.last_page)?'':'d-none'}>
                <tr>
                    <td ref="overscroller" colSpan="15" className={`position-relative py-3`}><i className="spinner"></i></td>
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
                            <div className='align-items-baseline row'>
                                <div className="col-md-2">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2">{trans('Airline')}</label>
                                        <select className="form-control" value={this.state.filter.airline_id} onChange={e=>this.onFilter(e, 'airline_id')}>
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.airlines.map(airline=><option key={`select-airline-${airline.id}`} value={airline.id}>{airline.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="lta_number" type="search" placeholder={trans("Rechercher un Nº LTA")} value={this.state.filter.lta_number} className={`form-control ${this.state.errors.indexOf('lta_number')>=0?'parsley-error':''}`} onChange={e=>{
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
                            <div className="align-items-baseline row">
                                <div className='col-md-2'>
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="document_number" type="search" placeholder={trans("Nº d'expédition")} value={this.state.filter.document_number} className="form-control" onChange={e=>{
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
                                <div className="col-md-2">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="container_id" type="search" placeholder={trans("Nº de conteneur")} value={this.models('state.filter.container_id', '')} className="form-control" onChange={e=>{
                                                const value = e.target.value
                                                this.setState(state=>{
                                                    state.filter.container_id = value
                                                    return state
                                                })
                                            }}/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={this.containerSearch}>{trans('OK')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="receptacle_id" placeholder={trans("Nº de récipient")} type="search" value={this.models('state.filter.receptacle_id', '')} className="form-control" onChange={e=>{
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
                                <div className="col-md-4 border rounded p-3">
                                    <form className="row m-0" name="frm_conveyence_reference" action={trans('/flights')}>
                                        <div className="col-md">
                                            <input key={`conveyence${this.state.t}`} type="text" name="s[conveyence_reference]" defaultValue={this.models('state.filter.conveyence_reference', '')} className="form-control" placeholder={trans('Nº de vol')}/>
                                        </div>
                                        <label className="control-label font-20 m-0">
                                            +
                                        </label>
                                        <div className="col-md">
                                            <Datepicker key={`datepicker${this.state.t}`} name="s[departure_datetime_lt]" defaultValue={moment(this.models('state.filter.departure_datetime_lt'))} placeholder={trans('Date')} className="w-100"/>
                                        </div>
                                        <button className="btn btn-primary">{trans('OK')}</button>
                                    </form>
                                </div>
                                <div className="col-md-2">
                                    <button className="btn bg-stone" type="button" onClick={this.handleClearFilter}>{trans('Effacer les filtres')}</button>
                                </div>
                            </div>
                        </div>
                        <div className="navPager d-flex align-items-center justify-content-end">
                            {this.nopaginate?null:pagination}
                        </div>
                    </div>
                    <h6>{trans('Liste des conteneurs')}</h6>
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="row m-0 justify-content-between">
                                <div className="filter d-flex align-items-center flex-wrap">
                                    <div>
                                        <span className="mr-4">{trans('Nombre de conteneurs')} : <strong>{this.state.total}</strong></span>
                                    </div>
                                    {this.nopaginate?null:<div className="form-group d-flex align-items-center justify-content-start flex-nowrap" style={{width:220}}>
                                        <label className="control-label">{trans('Voir')}</label>
                                        <select className="form-control" value={this.models('state.filter.perpage', 25)} onChange={e=>this.onFilter(e, 'perpage')}>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                        <label>{trans('par page')}</label>
                                    </div>}
                                </div>
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

export default List;