import React from "react";

const SearchModel = ({searchValue, handleChangeValue}) => {
    return(
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
              <div className="col-md-6 border rounded p-3 mr-4" >
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
                    <label className="control-label ml-5 mr-2 mb-0">ou</label>
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
        <div className="d-flex justify-content-between bd-highlight mt-4 w-100">
              <div className="p-2 ">
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
              <div className="p-2 w-50">
                  <div className="input-group" >
                      <input  name="uld" type="text" value={searchValue.uld} placeholder="N° d'ULD"  className="form-control" 
                          onChange={e => handleChangeValue(e)}
                      />
                        <div className="input-group-append">
                          <button className="btn-primary btn text-light"  type="button"
                                onClick={e=>{ e.preventDefault();
                                    console.log('ok');
                                }
                                }
                          >OK</button>
                        </div>
                    </div>
              </div>
              <div className="p-2 w-75 ">
              <div className="input-group" >
                      <input name="recipient" type="tex" placeholder="N° de récipient" value={searchValue.recipient} className="form-control" 
                        onChange={e => handleChangeValue(e)}
                      />
                        <div className="input-group-append">
                          <button className="btn-primary btn text-light" type="button">OK</button>
                        </div>
                    </div>
              </div>
              <div className="p-2 w-75">
                  <div className="input-group" >
                      <input name="mrdlabel" type="text" placeholder="MRD label" value={searchValue.mrdlabel} className="form-control" 
                        onChange= {e => handleChangeValue(e)}
                      />
                        <div className="input-group-append">
                          <button className="btn-primary btn text-light" type="button">OK</button>
                        </div>
                    </div>
              </div>
              <div className="p-2 w-50 mr-4 ">
                <div className="input-group"  >
                
                <input name="mrdlocation" type="text" placeholder="MRD location" value={searchValue.mrdlocation} className="form-control" 
                    onChange={e => handleChangeValue(e)}
                />
                
                  <div className="">
                    <button className="btn-primary btn text-light" type="button">OK</button>
                  </div>
                </div>
              </div>
        </div>
      
</div>
    )
}

export default SearchModel;