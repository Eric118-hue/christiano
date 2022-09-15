import React, {useRef, useState, useEffect} from 'react';
import $ from 'jquery';
import axios from 'axios';
import { DownloadTableExcel } from 'react-export-table-to-excel';




const TableResult = ({ulds, data}) => {
    const tableRef = useRef(null);
    const [carditUld, setcarditUld] = useState([]);
    const [isOpen, setIsOpen] =  useState(false)

    // useEffect(()=>{
    //     fetchCarditUld()

    //   },[])
     
      
    const fetchCarditUld = async (id) => {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/cardit_import/${id}`).then(({data})=>{
          const cardit = data.data
          setcarditUld(cardit);
         console.log(cardit);
        
        })
    }

    
    return (
      <div className="mt-5 pr-1 container-fluid bg-body rounded" style={{backgroundColor: "white", height:"500px"}}>
        <div className="d-flex">
            <div className="m-2 ml-4">
                <h4>RECEPTIONS IMPORT</h4>
            </div>
            <div className="d-inline m-3">
                <p>Nombre d'ULD: 6</p>
            </div>
            <div className="d-inline m-3">
                <p>Nombre de récipients: 8</p>
            </div>
            <div className="d-inline m-3">
                <p>Poids total: 78</p>
            </div>
            <div className="excel">
                <DownloadTableExcel filename="Uld"  sheet="users" currentTableRef={tableRef.current}>
                        <button type="button" className="btn btn-success"><i className="fas fa-file-excel"></i>Télécharger</button>
                </DownloadTableExcel>
            </div>
        </div>

            {/* Table */}
            
            <table ref={tableRef} className="table table-bordered table-hover table striped table-liste" style={{fontSize: "10px"}} >
            <thead>
                <tr>
                    <th scope="col" colSpan={2} className="text-wrap" style={{textAlign: "center", width: "50px"}}>Handover Date&Hour</th>
                    <th scope="col" style={{width: "300px", textAlign: "center"}}>ULD/Receptable</th>
                    <th scope="col" style={{width: "50px"}}>Origine</th>
                    <th scope="col" style={{width: "200px", textAlign: "center"}}>Actual arrival</th>
                    <th scope="col" style={{width: "80px", textAlign: "center"}}>Reg. vs arr</th>
                    <th scope="col" style={{width: "150px", textAlign: "center"}}>MRD Location</th>
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
                     { 
                        ulds.length > 0 ? (
                           ulds.map((item) => (                     
                            <tr key={item.id}  style={{backgroundColor: "rgb(214, 206, 206)"}}>
                                <th scope="row" >{item.handover_date}</th>
                                <td >{item.handover_time}</td>
                                <td>
                                    {item.code} <a href="#" className="btn-sm btn-icon btn-pure btn-turquoise on-default ml-2 m-r-5 button-edit"
                                        onClick={ e => {
                                            e.preventDefault()
                                            fetchCarditUld(item.id)
                                            
                                        }}
                                    ><i class="fas fa-caret-down"></i></a>

                
                                </td>
                                <td>{item.origine}</td>
                                <td>{item.actual_arrival}</td>
                                <td>{item.reg_arr}</td>
                                <td>{item.MRD_location}</td>
                                <td>{item.handler}</td>
                                <td>{item.MRD_label}</td>
                                <td>{item.regist_carr} </td>
                                <td>{item.regist_flight}</td>
                                <td>{item.attr_carrier}</td>
                                <td>{item.attr_receptacle}</td>
                                <td>{item.weight}</td>
                            </tr>
                      ))) : null
                     }

                    {
                        carditUld.length > 0 ? (
                            carditUld.map((car) => (
                                <tr>
                                     <td>{car.handover_date}</td>
                                    <td>{car.handover_time}</td>
                                    <td>{car.name}</td>
                                    <td>{car.origine}</td>
                                    <td>{car.actual_arrival}</td>
                                    <td>{car.origine}</td>
                                    <td>{car.actual_arrival}</td>
                                    <td>{car.reg_arr}</td>
                                    <td>{car.MRD_location}</td>
                                    <td>{car.handler}</td>
                                    <td>{car.MRD_label}</td>
                                    <td>{car.regist_carr} </td>
                                    <td>{car.regist_flight}</td>
                                    <td>{car.attr_carrier}</td>
                                    <td>{car.attr_receptacle}</td>
                                    <td>{car.weight}</td>
                                </tr>
                            ))
                        ) : null

                    }
                     
                
              
                
            </tbody>
            
    
            </table>
        
      </div>
    )
  
}
export default TableResult;
