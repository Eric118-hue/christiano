import React, {Component} from 'react';
import NavigableModel from '../../../vendor/Ry/Core/NavigableModel';
import trans from '../../translations';
import swal from 'sweetalert2';
import $ from 'jquery';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.model = 'airline';
        this.endpoint = '/clients/airlines';
        this.remove = this.remove.bind(this)
        this.handleSetup = this.handleSetup.bind(this)
    }

    handleSetup(event, customer_index, option) {
        const checked = event.target.checked
        this.setState(state=>{
            state.data[customer_index].nsetup[option] = checked
            state.data[customer_index].companies.map(company=>company.nsetup[option] = checked)
            $.ajax({
                url : '/customer',
                type : 'post',
                data : {
                    id : state.data[customer_index].id,
                    nsetup : state.data[customer_index].nsetup
                }
            })
            return state
        })
    }

    remove(customer) {
        const dis = this
        swal({
            title: trans('Confirmez-vous la suppression?'),
            text: trans('Cet enregistrement sera supprimé definitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme'),
            confirmButtonClass: 'bg-danger'
        }).then((result) => {
            if (result.value) {
                dis.setState(state=>{
                    state.data = state.data.filter(item=>customer.id!=item.id)
                    $.ajax({
                        type: 'delete',
                        url: '/client',
                        data : {
                            id : customer.id
                        }
                    })
                    return state
                })
            }
        });
    }

    item(customer, key) {
        return <tr key={`customer-${customer.id}`}>
            <td>{customer.id}</td>
            <td>{customer.facturable.name}</td>
            <td>
                <div className={`badge badge-rose`}>{trans('GHA')}</div>
            </td>
            <td className="text-right">
                <a className="btn btn-primary" href={`/client_edit?id=${customer.id}`}><i className="fa fa-edit"></i> {trans('Éditer')}</a>
                <button className="btn btn-danger ml-2" type="button" onClick={()=>this.remove(customer)}><i className="fa fa-remove"></i> {trans('Supprimer')}</button>
            </td>
        </tr>
    }

    beforelist() {
        return <a href="/client_add" className="btn btn-primary"><i className="fa fa-plus-circle"></i> {trans('Ajouter un client')}</a>
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
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{trans('Nom')}</th>
                                <th>{trans('Type')}</th>
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

Modelizer(List)

class GHAList extends Component
{
    render() {
        return <List store={this.props.store} data={this.props.data.data}/>
    }
}

export default GHAList;