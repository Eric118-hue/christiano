import React, {useState,useRef, useReducer, useEffect} from 'react';
import TableResult from './components/TableResult';
import './assets/import.scss';
import axios from 'axios';
import trans from '../../translations';
import SearchModel from './components/SearchModel';


function List() {
           const [uldLists, setuldList] = useState([]);
          const [filterInput, setFilterInput] = useReducer(
            (state, newState) => ({...state, ...newState}),
            {
                uld: "",
                recipient: "",
                mrdlabel: "",
                mrdlocation: ""
            }
          );
          const componentIsMounted = useRef(true);


          useEffect(()=>{
              fetchProducts() 
              
          },[]);
      
          // Fecthing Data
          const fetchProducts = async () => {
              await axios.get(`http://127.0.0.1:8000/api/cardit_import`).then(({data})=>{
                    const datas =data.data
                    setuldList(datas);
                    console.log(datas)
                  
              }).catch(err => {
                console.log(err);
              });
             
          }

            // HandleFileter
          const handleFilter = eve => {
            const {name, value} = eve.target;
            setFilterInput({ [name]: value})
          }
  
          const filters = list => {
            return list.filter(item => {
                return(
                  item.code.toLowerCase().includes(filterInput.uld.toLowerCase()) &&
                  item.regist_flight.toLowerCase().includes(filterInput.recipient.toLowerCase())&&
                  item.MRD_label.toLowerCase().includes(filterInput.mrdlabel.toLowerCase())&&
                  item.MRD_location.toLowerCase().includes(filterInput.mrdlocation.toLowerCase())
                );
            });
          }

        const values = filters(uldLists)


     
     
 
    return (
      <div className='content'>
        
          <SearchModel searchValue={filterInput} handleChangeValue={handleFilter}/>
          
      
          {/* Table result */}
        <div>
          <TableResult ulds={values}/>
        </div>
      
      </div>
    )
  }

  export default List;