import React, {Component} from 'react';
import trans from '../translations';
import moment from 'moment';

class Upu extends Component
{
    render() {
        return <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    {trans('UPU Master code list')}
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>{trans('Code List Number')}</th>
                                <th>{trans('Code List Name')}</th>
                                <th>{trans('Date the code list was last modified')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.data.map(item=><tr key={`list0-${item.id}`}>
                                <td>{item.code}</td>
                                <td>{item.name}</td>
                                <td>{moment(item.revision_at).format('DD/MM/YYYY')}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

export default Upu;