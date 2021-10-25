import React, {Component} from 'react';
import NavigableModel from 'ryvendor/Ry/Core/NavigableModel';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import {store} from 'ryvendor/Ry/Core/Ry';
import swal from 'sweetalert2';
import trans from 'ryapp/translations';
import $ from 'jquery';

class List extends NavigableModel
{
	constructor(props) {
		super(props)
		this.model = 'postoffice'
		this.endpoint = '/postoffices/list'
		this.remove = this.remove.bind(this)
	}
	
	remove(postoffice) {
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
                    state.data = state.data.filter(item=>postoffice.id!=item.id)
                    $.ajax({
                        type: 'delete',
                        url: '/postoffices/delete',
                        data : {
                            id : postoffice.id
                        }
                    })
                    return state
                })
            }
        });
    }
	
	item(postoffice, index) {
		return <tr key={postoffice.id}>
			<td>{postoffice.id}</td>
			<td>{postoffice.operator.edi_address}</td>
			<td>{postoffice.operator.operator}</td>
			<td className="text-right">
                <a className="btn btn-primary" href={`/postoffices/edit?id=${postoffice.id}`}><i className="fa fa-edit"></i> {trans('Éditer')}</a>
                <button className="btn btn-danger ml-2" type="button" onClick={()=>this.remove(postoffice)}><i className="fa fa-remove"></i> {trans('Supprimer')}</button>
            </td>
		</tr>
	}
	
	beforelist() {
        return <a href="/postoffices/add" className="btn btn-primary"><i className="fa fa-plus-circle"></i> {trans('Ajouter une poste')}</a>
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

class PostofficeList extends Component
{
	render() {
		return <List data={this.props.data.data} store={store}/>
	}
}

export default Modelizer(PostofficeList)