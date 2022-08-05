import React, { Component } from 'react';
import NavigableModel from '../Core/NavigableModel';
import trans from '../../../app/translations';
import swal from 'sweetalert2';

const MODEL = 'templates'

class Email extends Component
{
    constructor(props) {
        super(props)
        this.remove = this.remove.bind(this)
    }

    remove(event) {
        event.preventDefault();
        const dis = this;
        swal({
            title: trans('Confirmez-vous la suppression de cette template?'),
            text: trans('Cette template sera supprimé définitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme'),
            confirmButtonClass: 'bg-danger'
        }).then((result) => {
            if (result.value) {
                dis.setState({
                    removing: true
                });
                dis.props.remove({
                    success : ()=>{
                        swal(
                            trans('Supprimé'),
                            trans('La template a été supprimée'),
                            'success'
                        )
                    },
                    error : () => {
                        dis.setState({
                            removing: false
                        });
                    }
                })
            }
        })
        return false
    }

    render() {
        let channels = []
        for(var channelClass in this.props.data.archannels)
            channels.push(trans(this.props.data.archannels[channelClass]))
        return <tr>
            <td>{this.props.data.name}</td>
            <td>{this.props.data.title}</td>
            <td>{this.props.data.subject}</td>
            <td>
                <a className="btn btn-primary" href={`/templates_edit?id=${this.props.data.id}`}>{trans('Éditer')}</a>
                <button type="button" className="ml-3 btn btn-danger" onClick={this.remove}>{trans('Supprimer')}</button>
            </td>
        </tr>
    }
}

class Liste extends NavigableModel
{
    constructor(props) {
        super(props)
        this.endpoint = '/templates'
        this.model = MODEL
        this.nopaginate = true
    }

    item(item, key) {
        return <Email key={`email-${key}`} data={item} pkey={`email-${key}`} remove={(callbacks)=>this.remove(key, item.id, callbacks)}/>
    }

    beforelist() {
        return <a className="btn btn-primary mb-3" href={`/templates_add`} data-display="modal-xl">
                {trans('Ajouter une template')} <i className="fa fa-plus"></i>
            </a>
    }

    afterlist() {
        if(this.state.data.length>0)
            return this.beforelist()
        return null
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
            <table className="table table-striped table-light">
                <thead className="bg-stone">
                    <tr>
                        <th>{trans('Code e-mail')}</th>
                        <th className="text-capitalize">{trans('Titre')}</th>
                        <th className="text-capitalize">{trans('Sujet')}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map((item, key)=>this.item(item, key))}
                </tbody>
            </table>
            <div className="justify-content-between m-0 row">
                {this.afterlist()}
                {this.nopaginate?null:pagination}
            </div>
        </div>
    }
}

class Emails extends Component
{
    render() {
        return <Liste data={this.props.data.data} store={this.props.store}/>
    }
}

export default Emails;