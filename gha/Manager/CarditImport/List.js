import React from 'react';
import BaseList from '../../../vendor/Ry/Airline/Cardit/List';
import trans from '../../translations';

class List extends BaseList
{
    constructor(props) {
        super(props)
        this.readOnly = true
    }

    afterTh() {
        return <th></th>
    }

    afterTd(cardit) {
        return <td>
            <a href={`/cardit_delete?id=${cardit.id}`} className="btn btn-danger">{trans('Supprimer')}</a>
        </td>
    }

    beforelist() {
        return <div className="d-flex justify-content-center">
            <label className="btn btn-primary mr-2" data-name="precon" data-dropzone-action="/upload_precon" data-any-file="true">{trans('Importer un precon')}</label>
            <label className="btn btn-primary mr-30" data-name="cardit" data-dropzone-action="/upload_cardit" data-any-file="true">{trans('Importer un cardit')}</label>
        </div>
    }
}

export default List;