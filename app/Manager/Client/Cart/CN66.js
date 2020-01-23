import React, {Component} from 'react';

class CN66 extends Component
{
    render() {
        return <React.Fragment>
            <div className="form-inline"> 
        <div className="col-6">  
     		   <p>Opérateur désigné réacheminant les dépêches</p>
           <p>Bureau d'échange réacheminant les dépêches</p>
        </div> 

        <div className="col-3">  
           <h5>RELEVÉ DE POIDS<br/>Dépêches-avion et S.A.L</h5>
           <p>Date</p>           
        </div>   

        <div className="col-3"> 
          <h5 className="float-right">CN 66</h5>
        </div> 

      </div>   

        <div className="float-right mr-5">
         <div className="custom-control custom-checkbox">
           <input type="checkbox" className="custom-control-input" id="customCheck1"/>
           <label className="custom-control-label" for="customCheck1">Prioritaire/Par avion</label>           
         </div>

        <div className="custom-control custom-checkbox">  
          <input type="checkbox" className="custom-control-input" id="customCheck2"/>
          <label className="custom-control-label" for="customCheck2">Non prioritaire/S.A.L</label>
        </div>  
        </div>

         <table className="table table-bordered">
           <thead>
             <tr>
               <th scope="col" rowSpan="3" className="align-top">Opérateur désigné expéditeur des dépêches</th>
               <th scope="col" width="25%">Mois</th>
               <th scope="col" width="10%">Trimestre</th>               
               <th scope="col">Année</th>               
             </tr>
             <tr>                
               <td colSpan="3">Dépêches acheminées de</td>                                           
             </tr>             
         
             <tr>               
               <td colSpan="3">à</td>                                        
             </tr>
           </thead>           
         </table>

         <h4>Indications</h4>
         <p className="">Les observations éventuelles peuvent être indiquées au verso de la formule</p>

        <table className="table table-bordered">
            <thead className="table-bordered">
              <tr>
                <th scope="col-1" rowSpan="2" width="10%" className="align-middle">Date du transport</th>
                <th scope="col-1" rowSpan="2" width="10%" className="align-middle">Dépêche n°</th>
                <th scope="col-1" rowSpan="2" width="18%" className="align-middle">Bureau expéditeur</th>
                <th scope="col-1" rowSpan="2" width="18%" className="align-middle">Bureau de destination</th>
                <th scope="col-2" rowSpan="2" width="10%">N° de la ligne aérienne utilisée</th>
                <th scope="col-6" colSpan="4">Poids par catégorie d'envois</th>
              </tr>
              <tr>                
                <th colSpan="2">Poste aux lettres</th>
                <th colSpan="2">CP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">1</td>
                <td className="text-center">2</td>
                <td className="text-center">3</td>
                <td className="text-center">4</td>
                <td className="text-center">5</td>
                <td className="text-center" colSpan="2">6</td>
                <td className="text-center" colSpan="2">7</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>kg</td>
                <td>g</td>
                <td>kg</td>
                <td>g</td>
              </tr>             
            </tbody>
            <tbody>
              <td colSpan="5" className="text-right font-weight-bolder">Totaux</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tbody>
        </table>

        <div>
          <p>Dimensions 210 x 297 mm</p>
        </div>  
        </React.Fragment>
    }
}

export default CN66;