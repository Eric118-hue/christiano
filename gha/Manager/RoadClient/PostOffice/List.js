import React, { Component } from 'react';
import NavigableModel from 'ryvendor/Ry/Core/NavigableModel';
import trans from 'ryapp/translations';
import $ from 'jquery';
import qs from 'qs';
import Ry from 'ryvendor/Ry/Core/Ry';

class PostOfficeList extends NavigableModel
{
    constructor(props) {
        super(props)
        this.state.tfilter = {}
        this.model = this.props.type;
        this.endpoint = this.props.endpoint
        this.onTfilter = this.onTfilter.bind(this)
        this.data = {
            json : true,
            s : {}
        }
    }

    builPaginationFromQuery(page) {
        let queries = {...this.data}
        queries.page = page
        return this.endpoint + '?' + qs.stringify(queries)
    }

    onTfilter(event, key) {
        const value = event.target.value
        this.setState(state=>{
            state.tfilter[key] = value
            return state
        })
        this.data.s[key] = value
        $.ajax({
            url : this.props.endpoint,
            data : this.data,
            success : response=>{
                this.props.store.dispatch({...response})
            }
        })
    }

    item(row, key) {
        return <tr key={`list-${row.id}`}>
          <td>{row.id}</td>
          <td>{row.precon}</td>
          <td>{row.cardit}</td>
          <td>{row.iftmin}</td>
          <td>{row.name}</td>
          <td>{row.adresse.raw}</td>
          <td>{row.adresse.ville.nom}</td>
          <td>{row.adresse.ville.cp}</td>
          <td>{row.adresse.ville.country.nom} [{row.adresse.ville.country.code}]</td>
          <td><a className="btn" href={`#dialog/dsv_post_office?id=${row.id}`}><i className="fa fa-pencil-alt text-secondary"></i></a></td>
          <td><button className="btn" type="button" onClick={()=>this.remove(key, row.id, {success:()=>null, error:()=>null})}><i className="fa fa-times text-danger"></i></button><Ry/></td>
        </tr>
    }

    beforelist() {
        return <div>
            <a className="btn btn-primary" href={`#dialog/dsv_post_office`}><i className="fa fa-plus"></i> {trans('Ajouter un adresse')}</a>
        </div>
    }

    afterlist() {
        return this.beforelist()
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

        return <div className="col-md-12">
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            {this.searchEngine()}
            <div className="card mt-3">
                <div className="card-header">
                    {this.props.title}
                </div>
                <div className="card-body overflow-auto">
                    <table className="table table-bordered table-striped table-nowrap">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>PRECON</th>
                                <th>CARDIT</th>
                                <th>IFTMIN</th>
                                <th>{trans('Nom')}</th>
                                <th>{trans('Adresse')}</th>
                                <th>{trans('Ville')}</th>
                                <th>{trans('CP')}</th>
                                <th>{trans('Pays')}</th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr className="bg-yellow">
                                {this.props.headers.map((header, key)=><th key={`header-${key}`}>
                                    <input type="search" value={this.state.tfilter[key]?this.state.tfilter[key]:''} onChange={e=>this.onTfilter(e, key)} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>)}
                                <th></th>
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

class List extends Component
{
  render() {
    return <PostOfficeList type="dsv_post_office" endpoint={`/dsv_post_offices`} title={this.props.data.page.title} headers={this.props.data.headers} data={this.props.data.data} store={this.props.store}/>
  }
}

export default List;