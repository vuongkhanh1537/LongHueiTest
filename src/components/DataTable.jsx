import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { fetchAllData, fetchDataByCusNo } from '../service/AppService';
import SearchBar from './SearchBar';
import { DataOption } from '../constants/DataOptionEnum';

const columns = [
  {id: 'cus_no', label: 'Customer No.'},
  {id: 'cus_name', label: 'Customer Name'},
  {id: 'prd_no', label: 'Product No.'},
  {id: 'prd_name', label: 'Product Name'},
  {id: 'upr', label: 'Unit Price Regular', align: 'center'},
  {id: 'up', label: 'Unit Price', align: 'center'},
  {id: 'qty', label: 'Quantity', align: 'center'},
  {id: 'diff', label: 'Difference(%)', align: 'center', format: (value) => value.toFixed(2)},
];

const createData = (id, {cus_no, cus_name, prd_no, prd_name, up, upr, qty}) => {
  const diff = ((up - upr) / upr * 100);
  return { id, cus_no, cus_name, prd_no, prd_name, up, upr, qty, diff };
}

const getAllData = async () => {
  let data = await fetchAllData();
  data = data.map((item, index) => createData(index, item));
  return data;
}

const getDataByCusNo = async (cusNo, option) => {
  let data = await fetchDataByCusNo(cusNo, option);
  data = data.map((item, index) => createData(index, item));
  return data
}

export default function DataTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchData = async () => {
    const data = await getAllData();
    console.log(data);
    setRows(data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);


  const handleOnSearch = async (query, option) => {
    console.log(query, option);
    if (query === '') {
      fetchData();
    } else {
      const data = await getDataByCusNo(query, option);
      setRows(data);
      setPage(0);
    }
  }

  return (<>
    <SearchBar onSearch={handleOnSearch} />
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow role="checkbox" key={row.id} className={row.diff == 0? 'greenRow' : row.diff < 0 ? 'redRow' : 'default'}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} sx={{color: row.diff > 0 ? 'black' : 'white'}}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>);
}
