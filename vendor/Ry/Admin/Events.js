import React, {Component} from 'react';
import trans from '../../../app/translations';
import $ from 'jquery';
import swal from 'sweetalert2';

class Item extends Component
{
    componentDidMount() {
        var AmDiffered = this.props.store
        $('a[href^="#dialog/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                AmDiffered.dispatch({type: 'dialog', url: dis.attr('href').replace('#dialog', ''), method: 'get'});
                return false;
            };
            if (!this.dialogBound) {
                $(this).bind('click', f);
                this.dialogBound = true;
            }
        });
    }

    render() {
        const event = this.props.event
        return <tr>
            <td>{event.code}</td>
            <td>{event.descriptif}</td>
            <td>
                <a className="btn btn-primary" href={`#dialog/event_edit?id=${event.id}`} data-display="modal-xl"><i className="fa fa-pencil-alt"></i> {trans('Éditer')}</a>
                <button className="btn btn-danger ml-3" type="button" onClick={this.props.remove}><i className="fa fa-minus-circle"></i> {trans('Supprimer')}</button>
            </td>
        </tr>
    }
}

class Events extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data : this.props.data.data
        }
        this.removeEvent = this.removeEvent.bind(this)
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='alerts') {
                this.setState({
                    data : storeState.data
                })
            }
        })
    }

    removeEvent(event) {
        const dis = this
        swal({
            title: trans('Confirmez-vous la suppression?'),
            text: trans('Cet enregistrement sera supprimé définitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme'),
            confirmButtonClass: 'bg-danger'
        }).then((result) => {
            if (result.value) {
                dis.setState(state=>{
                    state.data = state.data.filter(item=>event.id!=item.id)
                    $.ajax({
                        type: 'delete',
                        url: '/events',
                        data : {
                            id : event.id
                        }
                    })
                    return state
                })
            }
        });
    }

    render() {
        return <div className="col-md-12">
            <a href={`#dialog/event_add`} className="btn btn-primary" data-display="modal-xl"><i className="fa fa-plus"></i> {trans('Créer une alerte')}</a>
            <div className="card mt-3">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th style={{width:'20%'}}>{trans('Code')}</th>
                                <th className="text-capitalize" style={{width:'60'}}>{trans('Signification')}</th>
                                <th style={{width:'20%'}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(event=><Item key={`event-${event.id}`} event={event} remove={()=>this.removeEvent(event)} store={this.props.store}/>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

export default Events;