import React from 'react';
import NavigableModel from '../../vendor/Ry/Core/NavigableModel';
import trans from '../translations';
import $ from 'jquery';

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.state.tfilter = {}
        this.model = this.props.type;
        this.endpoint = this.props.endpoint
        this.onTfilter = this.onTfilter.bind(this)
    }

    onTfilter(event, key) {
        const value = event.target.value
        this.setState(state=>{
            state.tfilter[key] = value
            return state
        })
        let data = {
            json : true,
            s : {}
        }
        data.s[key] = value
        $.ajax({
            url : this.props.endpoint,
            data : data,
            success : response=>{
                this.props.store.dispatch({...response})
            }
        })
    }

    item(row, key) {
        return <tr key={`list-${row.id}`}>
            {this.props.headers.map((header, key2)=><td key={`item-${header}-${key2}`}>{Object.values(row)[key2+1]}</td>)}
        </tr>
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
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                {this.props.headers.map((header, key)=><th key={`header-${key}`}>{header}</th>)}
                            </tr>
                            <tr className="bg-yellow">
                                {this.props.headers.map((header, key)=><th key={`header-${key}`}>
                                    <input type="search" value={this.state.tfilter[key]?this.state.tfilter[key]:''} onChange={e=>this.onTfilter(e, key)} className="form-control" placeholder={trans('filtre_rapide')}/>
                                </th>)}
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

export default List;