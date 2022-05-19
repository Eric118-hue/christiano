import React, {Component} from 'react';
import NavigableModel from '../../vendor/Ry/Core/NavigableModel'
import trans from '../../app/translations';
import $ from 'jquery';
import qs from 'qs';

class Item extends Component
{
    constructor(props) {
        super(props)
        this.setCountry = this.setCountry.bind(this)
    }

    setCountry(event) {
        $.ajax({
            url : '/airline_update',
            type : 'post',
            data : {
                country_id : event.target.value,
                id : this.props.data.id
            }
        })
    }

    render() {
        return <tr>
            <td>{this.props.data.iata_code}</td>
            <td>{this.props.data.icao_code}</td>
            <td>{this.props.data.edi_code}</td>
            <td>{this.props.data.name}</td>
            <td>
                <select required onChange={this.setCountry} defaultValue={this.props.data.country_id} className="select-default">
                    <option value=""></option>
                    {this.props.countries.map(country=><option key={`country-${country.id}`} value={country.id}>{country.nom}</option>)}
                </select>
            </td>
        </tr>
    }
}

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.state.filter = {
            iata_code : '',
            edi_code : '',
            icao_code : '',
            name : '',
            country : {
                nom : ''
            }
        }
        this.model = 'airlines'
        this.endpoint = '/airlines'
        this.onFilter = this.onFilter.bind(this)
        this.data = {
            json : true,
            s : {}
        }
    }

    beforelist() {
        return <div></div>
    }

    afterlist() {
        return this.beforelist()
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

    item(airline, key) {
        return <Item key={`airline-${airline.id}`} data={airline} countries={this.props.countries}/>
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
                                <th className="text-capitalize">{trans('Code IATA')}</th>
                                <th className="text-capitalize">{trans('Code ICAO')}</th>
                                <th className="text-capitalize">{trans('Code EDI')} (160b)</th>
                                <th className="text-capitalize">{trans('Nom')}</th>
                                <th className="text-capitalize">{trans('Pays')}</th>
                            </tr>
                            <tr className="bg-yellow">
                                <th>
                                    <input type="search" value={this.state.filter.iata_code} onChange={e=>this.onFilter(e, 'iata_code')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.state.filter.icao_code} onChange={e=>this.onFilter(e, 'icao_code')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.state.filter.edi_code} onChange={e=>this.onFilter(e, 'edi_code')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.state.filter.name} onChange={e=>this.onFilter(e, 'name')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.state.filter.country.nom} onChange={e=>this.onFilter(e, 'country_nom')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
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

class Airline extends Component
{
    render() {
        return <List data={this.props.data.data} store={this.props.store} countries={this.props.data.countries}/>
    }
}

const Components = {
    List : Airline
}

export default Components