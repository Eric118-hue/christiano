import React, { Component } from 'react'

export default class TableResult extends Component {
  render() {
    return (
      <div class="mt-5 container-fluid bg-body rounded-4">
        <div class="d-flex justify-content-start align-items-center">
            <div class="m-2 ml-4">
                <h4>RECEPTIONS EXPORT</h4>
            </div>
            <div class="mt-3 ml-4">
                <p>Nombre d'ULD: 6</p>
            </div>
            <div class="mt-3 ml-4">
                <p>Nombre de recipients: 8</p>
            </div>
            <div class="mt-3 ml-4">
                <p>Poids total: 78</p>
            </div>
            <div class="mt-3- ml-5">
                <a href={''}>
                    <button type="button" class="btn btn-success"><i class="fas fa-file-excel"></i>Télécharger</button>
                </a>
            </div>
        </div>

            {/* Table */}
            <table class="table table-bordered mt-5" style={{fontSize: "10px"}} >
            <thead>
                <tr>
                    <th scope="col" colspan="2" class="text-wrap" style={{textAlign: "center", width: "60px"}}>Handover Date&Hour</th>
                    <th scope="col" style={{width: "300px", textAlign: "center"}}>ULD/Receptable</th>
                    <th scope="col" style={{width: "40px"}}>Origine</th>
                    <th scope="col" style={{width: "200px", textAlign: "center"}}>Actual arrival</th>
                    <th scope="col" style={{width: "80px", textAlign: "center"}}>Reg. vs arr</th>
                    <th scope="col" style={{width: "200px", textAlign: "center"}}>MRD Location</th>
                    <th scope="col" style={{width: "50px", textAlign: "center"}}>Handler</th>
                    <th scope="col" style={{width: "200px", textAlign: "center"}}>MRD Label</th>
                    <th scope="col" style={{width: "60px", textAlign: "center"}}>Regist. Carrier</th>
                    <th scope="col" style={{width: "60px", textAlign: "center"}}>Regist. Flight</th>
                    <th scope="col" style={{width: "60px", textAlign: "center"}}>Attributed Carrier</th>
                    <th scope="col" style={{width: "60px", textAlign: "center"}}>Attributed Receptacles</th>
                    <th scope="col" style={{width: "60px", textAlign: "center"}} >Weight</th>
                  </tr>
                  </thead>

                  <tbody>
                
                    <tr >
                        <th scope="row" >fd</th>
                        <td >fd</td>
                        <td> fdf</td>
                        <td>rrr</td>
                        <td>ff</td>
                        <td>ff</td>
                        <td>gg</td>
                        <td>bbf</td>
                        <td>bb</td>
                        <td>bb </td>
                        <td>ee</td>
                        <td>bb</td>
                        <td>er</td>
                        <td>gre</td>
                    </tr>
            </tbody>
            </table>

        
      </div>
    )
  }
}
