import React from 'react';
import BaseList from '../../../vendor/Ry/Cardit/List';

class List extends BaseList
{
    afterTh() {
        return <th></th>
    }

    afterTd(cardit) {
        return <td>
            <a href={`/cardit_delete?id=${cardit.id}`} className="btn btn-danger">Supprimer</a>
        </td>
    }

    beforelist() {
        return <div className="d-flex justify-content-center">
            <label className="btn btn-primary mr-30" data-name="cardit" data-dropzone-action="/upload_cardit" data-accepted-files=".txt">Importer un cardit</label>
        </div>
    }
}

export default List;