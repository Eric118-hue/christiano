import React, {Component} from 'react';
import TableResult from './components/TableResult';
import './assets/import.scss';



class List extends Component {
  render() {
    return (
      <div className='content'>
        <div className='toolbar'>
          <div className='toolbaritem'>
                  {/* Registered Carrier */}
            <label htmlFor="Register">Registered Carrier</label>
                <select class="form-select " data-style="btn-warning" style={{fontSize: "10px"}}>
                  <option selected>Tous</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>    
          </div>

          <div className='toolbaritem'>
                {/* Attribute Carrier */}
            <label htmlFor="Register">Attribute Carrier</label>
                <select class="form-select" data-style="btn-warning" style={{fontSize: "10px"}}>
                  <option selected>Tous</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
          </div>

          <div className='toolbaritem'>
            {/* Origine */}
            <label htmlFor="Register">Origine</label>
                <select className="form-select" data-style="btn-warning" style={{fontSize: "10px"}}>
                    <option selected>Tous</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </select>
          </div>

              {/* Filtring by date */}
          <div className='border d-flex justify-content-center align-items-center' style={{width: "620px"}} >
            <div className="form-check p-0 d-flex align-items-center">
                <input type="radio" className="form-check-input" name="flexRadioDefault" id="flexRadioDefault2"/>
                  <label className="form-check-label d-flex align-items-center" for="flexDefaultRadio1">
                      <input type="date" />
                      <p className="p-2">au</p>
                      <input type="date" />
                  </label>
            </div>

                  <p className='p-2'>ou</p>

            <div className="form-check" style={{marginLeft: "10px"}}>
                <input type="radio" className="form-check-input pr-0" name="flexRadioDefault" id="flexRadioDefault2"/>
                  <label className="form-check-label" for="flexDefaultRadio1">
                     <select className="form-select" aria-label="Default select example" style={{fontSize: "10px", float:"right"}} data-style="btn-warning">
                        <option selected>2022</option>
                        <option value="1">2021</option>
                        <option value="2">2020</option>
                        <option value="3">2012</option>
                      </select>
                  </label>
                 </div>
          </div>
        </div>

              {/* 2nd row of the Searching */}
        <div className="d-flex justify-content-sm-around flex-wrap pt-3">     
            <div className=" bd-highlight">
                <div className="form-group d-flex align-items-center ">
                    <label for="ber" className="col-xs-2 control-label">Registered flight</label>
                    <div className="col-xs-2 p-1">
                        <select className="form-select " aria-label="Default select example" data-style="btn-warning" style={{fontSize: "10px"}}>
                            <option selected>Tous</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                    </div>
                </div>
            </div>
          
            {/* Search with N_Uld */}
           <div class="p-2 bd-highlight">  
              <div className='input-group'>
                <div className="form-outline" style={{width: "200px"}}>
                  <input type="search"  placeholder="N° d'ULD" className="form-control" style={{ height: "30px", fontSize: "12px"}}/>
                </div>
                  <button type="submit" id="confirm_search" className="btn -primary" style={{backgroundColor: "blue", color: "white", height: "30px"}}>OK</button>
              </div>
            </div>

            {/* Search with N_recipient */}
            <div class="p-2 bd-highlight">  
              <div className='input-group'>
                <div className="form-outline" style={{width: "200px"}}>
                  <input type="search" placeholder="N° de récipient" className="form-control" style={{height: "30px", fontSize: "12px"}}/>
                </div>
                  <button type="submit" id="confirm_search" className="btn" style={{backgroundColor: "blue", color: "white", height: "30px"}}>OK</button>
              </div>
            </div>

            {/* Search with MRDLabel */}
            <div className="p-2 bd-highlight">  
              <div className='input-group'>
                <div className="form-outline" style={{width: "200px"}}>
                  <input type="search" placeholder="MRD Label" className="form-control" style={{height: "30px", fontSize: "12px"}}/>
                </div>
                  <button type="submit" id="confirm_search" className="btn" style={{marginLeft: "-10px", backgroundColor: "blue", color: "white", height: "30px"}}>OK</button>
              </div>
            </div>

            {/* Search with MRDLocation*/}
            <div className="p-2 bd-highlight">  
              <div className='input-group'>
                <div className="form-outline" style={{width: "200px"}}>
                  <input type="search"  placeholder="MRD Location" className="form-control" style={{height: "30px", fontSize: "12px"}}/>
                </div>
                  <button type="submit" id="confirm_search" className="btn" style={{marginLeft: "-10px", backgroundColor: "blue", color: "white", height: "30px"}}>OK</button>
              </div>
            </div>
            

       
        </div>
          {/* Table result */}
        <div>
          <TableResult/>
        </div>
      
      </div>
    )
  }
}

export default List;