// // import React, {useState, useEffect} from 'react';
// // import TableResult from './components/TableResult';
// // import './assets/import.scss';
// // import axios from 'axios';


// // function List() {
// //       const [uldLists, setuldList] = useState([]);
// //       const [updateList, setUpdateList] = useState([]);
// //       const [filterNuld, setfilterNuld] = useState("");
// //       const [filterNrecipient, setfilterRecipient] = useState("");
// //       const [filterMldlabel, setfilterMldlabel] = useState("");
// //       const [filterMldlocation, setfilterMldlocation] = useState("");

// //       useEffect(()=>{
// //           fetchProducts() 
// //       },[]);
  
// //       const fetchProducts = async () => {
// //           await axios.get(`${process.env.REACT_APP_API_URL}/api/cardit_import`).then(({data})=>{
// //               let uldlist = data.data;   
// //               setuldList(uldlist)
// //           // console.log(uldlist);
// //           })
// //       }
  
// //       const handleOnChange = (event, key) =>{
// //         const inputValue = event.target.value;
// //         switch(key) {
// //           case filterNuld:
// //             setfilterNuld( )
// //             break;
// //           case 'nrecipient':
// //             console.log('nrecipient');
// //             setqUld(e.target.value);
// //             // return data.filter((item) => item.regist_flight.toLowerCase().includes(qUld));
// //             break;
// //           case 'mrdlabel':
// //             console.log('mrdlabel');
// //             setqUld(e.target.value);
// //             // return data.filter((item) => item.MRD_label.toLowerCase().includes(qUld));
// //             break;
// //           case 'mrdlocation':
// //             console.log('mrdlocation');
// //             setqUld(e.target.value);
// //             // return data.filter((item) => item.MRD_location.toLowerCase().includes(qUld));
// //             break;
// //           default:
// //             console.log('Sorry');
// //         }
// //       }
// //       /**
// //        * Searching by Num Uld
// //        */
// //       const searchN_uld = (data) => {
// //         // console.log(qUld);
// //          return data.filter((item) => item.code.toLowerCase().includes(qUld));
// //       }
 
// //     return (
// //       <div className='content'>
// //         <div className='toolbar'>
// //           <div className='toolbaritem'>
// //                   {/* Registered Carrier */}
// //              <div className="col-md-2" >
//                     <div className="align-items-baseline d-flex form-group ml-2" style={{width: "220px"}}>
//                     <label className="control-label mr-2">Register Carrier</label>
//                     <select className="form-control" >
//                       <option value="">Tous</option>
//                       <option value="1">One</option>
//                       <option value="2">Two</option>
//                       <option value="3">Three</option>
//                     </select>
//                     </div>
//                     </div>
//           </div>

// //           <div className='toolbaritem'>
// //                 {/* Attribute Carrier */}
// //             <label htmlFor="Register">Attribute Carrier</label>
// //                 <select class="form-select" data-style="btn-warning" style={{fontSize: "10px"}}>
// //                   <option selected>Tous</option>
// //                   <option value="1">One</option>
// //                   <option value="2">Two</option>
// //                   <option value="3">Three</option>
// //                 </select>
// //           </div>

// //           <div className='toolbaritem'>
// //             {/* Origine */}
// //             <label htmlFor="Register">Origine</label>
// //                 <select className="form-select" data-style="btn-warning" style={{fontSize: "10px"}}>
// //                     <option selected>Tous</option>
// //                     <option value="1">One</option>
// //                     <option value="2">Two</option>
// //                     <option value="3">Three</option>
// //                 </select>
// //           </div>

// //               {/* Filtring by date */}
// //           <div className='border d-flex justify-content-center align-items-center' style={{width: "620px"}} >
// //             <div className="form-check p-0 d-flex align-items-center">
// //                 <input type="radio" className="form-check-input" name="flexRadioDefault" id="flexRadioDefault2"/>
// //                   <label className="form-check-label d-flex align-items-center" for="flexDefaultRadio1">
// //                       <input type="date" />
// //                       <p className="p-2">au</p>
// //                       <input type="date" />
// //                   </label>
// //             </div>

// //                   <p className='p-2'>ou</p>

// //             <div className="form-check" style={{marginLeft: "10px"}}>
// //                 <input type="radio" className="form-check-input pr-0" name="flexRadioDefault" id="flexRadioDefault2"/>
// //                   <label className="form-check-label" for="flexDefaultRadio1">
// //                      <select className="form-select" aria-label="Default select example" style={{fontSize: "10px", float:"right"}} data-style="btn-warning">
// //                         <option selected>2022</option>
// //                         <option value="1">2021</option>
// //                         <option value="2">2020</option>
// //                         <option value="3">2012</option>
// //                       </select>
// //                   </label>
// //                  </div>
// //           </div>
// //         </div>

// //               {/* 2nd row of the Searching */}
// //         <div className="d-flex justify-content-sm-around flex-wrap pt-3">     
// //             <div className=" bd-highlight">
// //                 <div className="form-group d-flex align-items-center ">
// //                     <label for="ber" className="col-xs-2 control-label">Registered flight</label>
// //                     <div className="col-xs-2 p-1">
// //                         <select className="form-select " aria-label="Default select example" data-style="btn-warning" style={{fontSize: "10px"}}>
// //                             <option selected>Tous</option>
// //                             <option value="1">One</option>
// //                             <option value="2">Two</option>
// //                             <option value="3">Three</option>
// //                           </select>
// //                     </div>
// //                 </div>
// //             </div>
          
// //             {/* Search with N_Uld */}
// //            <div class="p-2 bd-highlight">  
// //               <div className='input-group'>
// //                 <div className="form-outline" style={{width: "200px"}}>
// //                   <input type="search" id='nuld' onChange={handleOnChange}  placeholder="N° d'ULD" className="form-control" style={{ height: "30px", fontSize: "12px"}}/>
// //                 </div>
// //                   <button type="submit" id="confirm_search" className="btn -primary" style={{backgroundColor: "blue", color: "white", height: "30px"}}>OK</button>
// //               </div>
// //             </div>

// //             {/* Search with N_recipient */}
// //             <div class="p-2 bd-highlight">  
// //               <div className='input-group'>
// //                 <div className="form-outline" style={{width: "200px"}}>
// //                   <input type="search" id="nrecipient" onChange={handleOnChange} placeholder="N° de récipient" className="form-control" style={{height: "30px", fontSize: "12px"}}/>
// //                 </div>
// //                   <button type="submit" id="confirm_search" className="btn" style={{backgroundColor: "blue", color: "white", height: "30px"}}>OK</button>
// //               </div>
// //             </div>

// //             {/* Search with MRDLabel */}
// //             <div className="p-2 bd-highlight">  
// //               <div className='input-group'>
// //                 <div className="form-outline" style={{width: "200px"}}>
// //                   <input type="search" id='mrdlabel' onChange={handleOnChange} placeholder="MRD Label" className="form-control" style={{height: "30px", fontSize: "12px"}}/>
// //                 </div>
// //                   <button type="submit" id="confirm_search" className="btn" style={{marginLeft: "-10px", backgroundColor: "blue", color: "white", height: "30px"}}>OK</button>
// //               </div>
// //             </div>

// //             {/* Search with MRDLocation*/}
// //             <div className="p-2 bd-highlight">  
// //               <div className='input-group'>
// //                 <div className="form-outline" style={{width: "200px"}}>
// //                   <input type="search" id='mrdlocation' onChange={handleOnChange} placeholder="MRD Location" className="form-control" style={{height: "30px", fontSize: "12px"}}/>
// //                 </div>
// //                   <button type="submit" id="confirm_search" className="btn" style={{marginLeft: "-10px", backgroundColor: "blue", color: "white", height: "30px"}}>OK</button>
// //               </div>
// //             </div>
            

       
// //         </div>
// //           {/* Table result */}
// //         <div>
// //           <TableResult ulds={searchN_uld(uldLists)}/>
// //         </div>
      
// //       </div>
// //     )
// //   }


// // export default List;

import React, {useState, useEffect} from 'react';
import TableResult from './components/TableResult';
import './assets/import.scss';
import axios from 'axios';
import trans from '../../translations';


function List() {
      const [qUld, setqUld] = useState("");
      const [uldLists, setuldList] = useState([]);

      useEffect(()=>{
          fetchProducts() 
      },[]);
  
      const fetchProducts = async () => {
          await axios.get(`${process.env.REACT_APP_API_URL}/api/cardit_import`).then(({data})=>{
              let uldlist = data.data;   
              setuldList(uldlist)
          // console.log(uldlist);
          })
      }
  
     
      /**
       * Searching by Num Uld
       */
      const searchN_uld = (data) => {
        // console.log(qUld);
         return data.filter((item) => item.code.toLowerCase().includes(qUld));
      }
 
    return (
      <div className='content'>
        <div className='d-flex flex-wrap'>
          <div className='toolbarItem'>
            <div className="col-md-2 mt-3" >
                  <div className="align-items-baseline d-flex form-group ml-2" style={{width: "220px"}}>
                      <label className="control-label mr-2">Register Carrier</label>
                      <select className="form-control" >
                        <option value="">Tous</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                  </div>
              </div>
          </div>
        
          <div className='toolbarItem'>
            <div className="col-md-1 mt-3">
                <div className="align-items-baseline d-flex form-group ml-2" style={{width: "220px"}}>
                    <label className="control-label mr-2">Attribute Carrier</label>
                    <select className="form-control" >
                      <option value="">Tous</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                </div>
            </div>
          </div>

         {/* Origine */}

         <div className='toolbarItem'>
            <div className="col-md-2 mt-3">
                <div className="align-items-baseline d-flex form-group ml-2" style={{width: "220px"}}>
                    <label className="control-label mr-2">Origine</label>
                    <select className="form-control" >
                      <option value="">Tous</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                    <div className="m-auto">
                      <i className="fa fa-2x mx-2 fa-caret-right"></i>
                    </div>
                </div>
            </div>
          </div>

          
              {/* Filtring by date */}
              <div className="col-md-6 border rounded p-3 " >
                  <div className="d-flex ">
                    <label className="fancy-radio m-auto custom-color-green">
                      <input  type="radio" value="date"/>
                        <span><i className="mr-0"></i></span>
                    </label>
                  <div className="input-group date ">
                      <input type="text" className="form-control " defaultValue="DD/MM/YYYY"/>
                       <div className="input-group-append"> 
                          <button className="btn-primary btn text-light" type="button"><i className="fa fa-calendar-alt"></i></button>
                       </div>
                  </div>
                  <div className="form-group m-auto">
                      <label className="control-label mx-2 mb-0">au</label>
                  </div>
                  <div  className="input-group date mx-2">
                      <input type="text" className="form-control" value="DD/MM/YYYY"/>
                      <div className="input-group-append"> 
                        <button className="btn-primary btn text-light" type="button"><i className="fa fa-calendar-alt"></i></button>
                      </div>
                  </div>
                  <div className="form-group m-auto">
                    <label className="control-label ml-5 mr-2 mb-0">{trans('ou')}</label>
                  </div>
                  <label className="fancy-radio m-auto custom-color-green mx-2">
                    <input  type="radio" value="year" />
                    <span><i className="mr-0"></i></span>
                  </label>
                  <select className="form-control mx-2 w-50" >
                      <option >2021</option>
                      <option >2022</option>
                  </select>
              </div>
            
         </div>      
      

              {/* 2nd row of the Searching */}
      <div className='toolbar'>        
        <div className="d-flex flex-wrap pt-2">   
            <div className="col-md-2">
                  <div className="align-items-baseline d-flex form-group ml-2" style={{width: "200px"}}>
                      <label className="control-label mr-2">Register flight</label>
                      <select className="form-control" >
                        <option value="">Tous</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                  </div>
              </div>
           

            {/* Search with N_Uld */}
            
              <div className="col-md-2" >
                <div className="d-flex " >
                    <div className="input-group" >
                      <input  type="search" placeholder="N° d'ULD" value="" className="form-control" />
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="button">OK</button>
                        </div>
                    </div>
                </div>
              </div>
            

            {/* Search with N_recipient */}
            
            <div className="col-md-3 " >
                <div className="d-flex " >
                    <div className="input-group" >
                      <input  type="search" placeholder="N° de récipient" value="" className="form-control" style={{width: "400px !important"}} />
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="button">OK</button>
                        </div>
                    </div>
                </div>
              </div>
            

            {/* Search with MRDLabel */}
            
            <div className="col-md-3" >
                <div className="d-flex " >
                    <div className="input-group " >
                      <input  type="search" placeholder="MRD label" value="" className="form-control" />
                        <div className="input-group-append">
                          <button className="btn" type="button">OK</button>
                        </div>
                    </div>
                </div>
              </div>
            

            
              <div className="col-md-2" >
                <div className="d-flex " >
                    <div className="input-group" >
              
                      <input  type="search" placeholder="MRD location" value="" className="form-control" />
                      
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="button">OK</button>
                        </div>
                    </div>
                </div>
              </div>
            

      </div>
      </div>
    </div>  

      
          {/* Table result */}
        <div>
          <TableResult ulds={uldLists}/>
        </div>
      
      </div>
    )
  }

  export default List;