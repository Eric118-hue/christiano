import React, {Component} from 'react';
import NavigableModel from '../../vendor/Ry/Core/NavigableModel';
import trans from '../translations';
import Modelizer from '../../vendor/Ry/Core/Modelizer';
import {Popup, PopupBody, PopupHeader, PopupFooter} from 'ryvendor/bs/bootstrap';
import $ from 'jquery';
import qs from 'qs';

export class Form extends Component
{
    render() {
        return <form name="frm_airport" action="/airport" method="post">
            <input type="hidden" name="id" value={this.props.data.data.id}/>
            <PopupHeader><h5>{trans("Ville de l'aéroport")}</h5></PopupHeader>
            <PopupBody>
                <div className="form-group">
                    <label className="control-label">{trans('Ville')}</label>
                    <input type="text" name="ville[nom]" className="form-control" defaultValue={this.models('props.data.data.ville.nom')}/>
                </div>
            </PopupBody>
            <PopupFooter>
                <button className="btn btn-primary">{trans('Enregistrer')}</button>
            </PopupFooter>
        </form>
    }
}

Modelizer(Form)

class Item extends Component
{
    render() {
        return <tr>
            <td>{this.props.data.iata}</td>
            <td>{this.props.data.name}</td>
            <td>{this.models('props.data.ville.nom')}</td>
            <td>{this.models('props.data.country.nom')}</td>
            <td><a href={`#dialog/airport?id=${this.props.data.id}`} className="btn btn-primary"><i className="fa fa-pencil-alt"></i></a></td>
        </tr>
    }
}

Modelizer(Item)

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.state.filter = {
            iata : '',
            name : '',
            country_name : ''
        }
        this.model = 'airports';
        this.endpoint = '/airports';
        this.onFilter = this.onFilter.bind(this);
        this.data = {
            json : true,
            s : {}
        }
    }

    item(airport, key) {
        return <Item key={`list-airport-${key}`} data={airport} remove={(callbacks)=>this.remove(key, airport.id, callbacks)}/>
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
                this.props.store.dispatch({...response})
            }
        })
    }

    builPaginationFromQuery(page) {
        let queries = {...this.data}
        queries.page = page
        return this.endpoint + '?' + qs.stringify(queries)
    }

    render() {
        let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.props.data.total?'d-none':''}`}>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toEnd}><i className="fa fa-angle-double-right"></i></a>
            </li>
        </ul>

        return <div className="col-12">            
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            {this.searchEngine()}
            <div className="card mt-3">
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th className="text-capitalize">{trans('Code')}</th>
                                <th className="text-capitalize">{trans('Nom')}</th>
                                <th className="text-capitalize">{trans('Ville')}</th>
                                <th className="text-capitalize">{trans('Pays')}</th>
                                <th></th>
                            </tr>
                            <tr className="bg-yellow">
                                <th>
                                    <input type="search" value={this.state.filter.iata} onChange={e=>this.onFilter(e, 'iata')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.state.filter.name} onChange={e=>this.onFilter(e, 'name')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.state.filter.ville_name} onChange={e=>this.onFilter(e, 'ville_name')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.state.filter.country_name} onChange={e=>this.onFilter(e, 'country_name')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((item, key)=>this.item(item, key))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="justify-content-between m-0 row">
                {this.afterlist()}
                {this.nopaginate?null:pagination}
            </div>
        </div>
    }
}

class Airport extends Component
{
    render() {
        return <List data={this.props.data.data} store={this.props.store}/>
    }
}

export default Airport;