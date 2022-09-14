import React, {useRef} from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel';

const TableResult = ({ulds, data}) => {
    const tableRef = useRef(null);

    
    return (
      <div className="mt-5 pr-1 container-fluid bg-body rounded" style={{backgroundColor: "white", height:"500px"}}>
        <div className="d-flex justify-content-start align-items-center flex-wrap p-3">
            <div className="m-2 ml-4">
                <h4>RECEPTIONS EXPORT</h4>
            </div>
            <div className="mt-3 ml-4">
                <p>Nombre d'ULD: 6</p>
            </div>
            <div className="mt-3 ml-4">
                <p>Nombre de recipients: 8</p>
            </div>
            <div className="mt-3 ml-4">
                <p>Poids total: 78</p>
            </div>
            <DownloadTableExcel filename="Uld"  sheet="users" currentTableRef={tableRef.current}  className="mt-2" style={{marginLeft:"750px"}} >
                    <button type="button" className="btn btn-success"><i className="fas fa-file-excel"></i>Télécharger</button>
            </DownloadTableExcel>
        </div>

            {/* Table */}
            
            <table ref={tableRef} className="table table-bordered mt-1" style={{fontSize: "10px"}} >
            <thead>
                <tr>
                    <th scope="col" colSpan="2" className="text-wrap" style={{textAlign: "center", width: "50px"}}>Handover Date&Hour</th>
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
                                <td>{item.code} 
                                <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">drp</button>
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
                    <tr className='collapse' id='collapseExample'  >
                        <th scope="row" >fd</th>
                        <td >fd</td>
                        <td> fdf  
                        {/* <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">drp</button> */}
                        </td>
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
            {/* </table>

            <table className='collapse' id='collapseExample' >

            <tbody style={{backgroundColor: "rgb(215, 206, 206)"}}>
                
              
        </tbody> */}
    
            </table>
        
      </div>
    )
  }
export default TableResult;


// const useRowStyles = makeStyles({
//   root: {
//     '& > *': {
//       borderBottom: 'unset',
//     },
//   },
// });

// function createData(name, calories, fat, carbs, protein, price) {
//   return {
//     name,
//     calories,
//     fat,
//     carbs,
//     protein,
//     price,
//     history: [
//       { date: '2020-01-05', customerId: '11091700', amount: 3 },
//       { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
//     ],
//   };
// }

// function Row(props) {
//   const { row } = props;
//   const [open, setOpen] = React.useState(false);
//   const classes = useRowStyles();

//   return (
//     <React.Fragment>
//       <TableRow className={classes.root}>
//         <TableCell>
//           <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell component="th" scope="row">
//           {row.name}
//         </TableCell>
//         <TableCell align="right">{row.calories}</TableCell>
//         <TableCell align="right">{row.fat}</TableCell>
//         <TableCell align="right">{row.carbs}</TableCell>
//         <TableCell align="right">{row.protein}</TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box margin={1}>
//               <Typography variant="h6" gutterBottom component="div">
//                 History
//               </Typography>
//               <Table size="small" aria-label="purchases">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Date</TableCell>
//                     <TableCell>Customer</TableCell>
//                     <TableCell align="right">Amount</TableCell>
//                     <TableCell align="right">Total price ($)</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {row.history.map((historyRow) => (
//                     <TableRow key={historyRow.date}>
//                       <TableCell component="th" scope="row">
//                         {historyRow.date}
//                       </TableCell>
//                       <TableCell>{historyRow.customerId}</TableCell>
//                       <TableCell align="right">{historyRow.amount}</TableCell>
//                       <TableCell align="right">
//                         {Math.round(historyRow.amount * row.price * 100) / 100}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

// Row.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired,
//       }),
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//   }).isRequired,
// };

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
//   createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
//   createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
//   createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
// ];

// export default function CollapsibleTable() {
//   return (
//     <TableContainer component={Paper}>
//       <Table aria-label="collapsible table">
//         <TableHead>
//           <TableRow>
//             <TableCell />
//             <TableCell>Dessert (100g serving)</TableCell>
//             <TableCell align="right">Calories</TableCell>
//             <TableCell align="right">Fat&nbsp;(g)</TableCell>
//             <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//             <TableCell align="right">Protein&nbsp;(g)</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <Row key={row.name} row={row} />
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }