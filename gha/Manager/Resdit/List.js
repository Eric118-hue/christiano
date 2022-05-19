import React, { Component } from 'react';
import NavigableModel from '../../../vendor/Ry/Core/NavigableModel';
import trans from '../../translations';
import Item from './Item';

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.model = 'resdit'
        this.endpoint = '/resdits'
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
            <div className="card">
                <div className="card-body">
                    <table className="table table-bordered">
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
                                <th>{trans('Télécharger')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((item, key)=><Item key={`resdit-${item.id}`}  data={item} irregularites={this.irregularites} performances={this.performances} completed={this.completed} consignmentEvents={this.props.data.consignment_events} store={this.props.store}/>)}
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

class ResditList extends Component
{
    render() {
        return <List data={this.props.data.data} store={this.props.store}/>
    }
}

export default ResditList;