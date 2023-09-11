import React, { useState, useEffect } from 'react';
import {BsFillTrashFill} from 'react-icons/bs';
import axios from 'axios';
import ButtonDownload from './ButtonDownload';
import ButtonOpen from "./ButtonOpening";

export default function ShowInvoices() {
  const [dataInvoices, setDataInvoices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const invoicesPerPage = 7;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchInvoices(token);
    } 
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await axios.get('http://localhost:1337/api/Invoices/?populate[customer]=*', {headers});
      console.log(res.data.data);
      setDataInvoices(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

   //Function delete 
   const handleDelete = async (invoiceId,customerId) => {
    try {
      const token = localStorage.getItem('token');
      const resInvoice = await axios.delete(`http://localhost:1337/api/Invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resCustomer = await axios.delete(`http://localhost:1337/api/Customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataInvoices(prevData => prevData.filter(item => item.id !== invoiceId));
      console.log('Element has been deleted');
    } catch (error) {
      console.log(error);
    }
  };
    
  //Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredData = dataInvoices.filter((item) => {
    const { id, attributes } = item;
    const invoiceNumber = attributes.number.toLowerCase();
    const companyName = attributes.customer.data.attributes.companyName.toLowerCase();
    const invoiceDate = attributes.date;
    const createdAt =
      'Date : ' + attributes.createdAt.slice(0, 9) + ' , Time : ' + attributes.createdAt.slice(11, 18);

    return (
      invoiceNumber.includes(search.toLowerCase()) ||
      createdAt.includes(search.toLowerCase()) ||
      companyName.includes(search.toLowerCase()) ||
      invoiceDate.includes(search)
    );
  });

  const startIndex = (currentPage - 1) * invoicesPerPage;
  const endIndex = startIndex + invoicesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Function search
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  
  //Sort 
  const [sortOption, setSortOption] = useState('invoiceDate');
  const [sortDirection, setSortDirection] = useState('asc');

  const sortedDataFunction = (data, sortOption, sortDirection) => {
    return data.slice().sort((a, b) => {
      const aAttributes = a.attributes;
      const bAttributes = b.attributes;
  
      if (sortOption === 'invoiceDate') {
        return sortDirection === 'asc'
          ? new Date(aAttributes.date) - new Date(bAttributes.date)
          : new Date(bAttributes.date) - new Date(aAttributes.date);
      } else if (sortOption === 'companyName') {
        const companyNameA = aAttributes.customer.data.attributes.companyName.toLowerCase();
        const companyNameB = bAttributes.customer.data.attributes.companyName.toLowerCase();
        return sortDirection === 'asc'
          ? companyNameA.localeCompare(companyNameB)
          : companyNameB.localeCompare(companyNameA);
      }else if (sortOption === 'invoiceNumber') {
        const invoiceNumberA = aAttributes.number.toLowerCase();
        const invoiceNumberB = bAttributes.number.toLowerCase();
        return sortDirection === 'asc'
          ? invoiceNumberA.localeCompare(invoiceNumberB)
          : invoiceNumberB.localeCompare(invoiceNumberA);
      } else if (sortOption === 'createdAt') {
        const createdAtA = aAttributes.createdAt;
        const createdAtB = bAttributes.createdAt;
        return sortDirection === 'asc'
          ? createdAtA.localeCompare(createdAtB)
          : createdAtB.localeCompare(createdAtA);
      }
      return 0;
    });
  };
  
  const sortedData = sortedDataFunction(paginatedData, sortOption, sortDirection);

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };
 
  return (
    <div className='mt-2'>
      <div className="relative overflow-x-auto p-2 rounded-lg ml-2 mr-2">
        <div className='flex justify-between mb-3'>
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center">
        <label htmlFor="sortOption" className="block text-m mr-2 ml-1 font-serif text-gray-700 dark:text-white">
          Sort by :
        </label>
        <select
  id="sortOption"
  className="inline-flex items-center text-gray-500 bg-gray-50 border mr-2 border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-serif rounded-lg text-sm p-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
  value={sortOption}
  onChange={handleSortOptionChange}
>
  <option value="invoiceNumber">Invoice Number</option>
  <option value="companyName">Company Name</option>
  <option value="invoiceDate">Invoice Date</option>
  <option value="createdAt">Created At</option>
</select>
        <label htmlFor="sortDirection" className="block text-m mr-2 font-serif text-gray-700 dark:text-white">
          Direction :
        </label>
        <select
          id="sortDirection"
          className="inline-flex items-center text-gray-500 bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-serif rounded-lg text-sm p-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
        </div>
        <table
          className="text-sm text-left text-gray-500 dark:text-gray-400"
          style={{
            width: '99%',
            marginLeft: '9px',
            marginRight: '3px',
            marginTop: '10px',
            backgroundColor: 'rgba(243, 244, 246, 0.2)',
            padding: '10px',
          }}
        >
          <thead className="text-m text-white bg-gradient-to-br uppercase from-gray-400 to-slate-500 dark:text-gray-400 text-center">
            <tr>
              <th scope="col" className="px-2 py-3">
                Invoice Number
              </th>
              <th scope="col" className="px-2 py-3">
                Customer Name
              </th>
              <th scope="col" className="px-3 py-3 flex ">
                Invoice Date
              </th>
              <th scope="col" className="px-6 py-3 ">
                Created at
              </th>
              <th scope="col" className="px-6 py-3">
                <div className='flex justify-center'>
                Open
                <svg className="ml-2 w-5 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                <path d="M17 0h-5.768a1 1 0 1 0 0 2h3.354L8.4 8.182A1.003 1.003 0 1 0 9.818 9.6L16 3.414v3.354a1 1 0 0 0 2 0V1a1 1 0 0 0-1-1Z"/>
               <path d="m14.258 7.985-3.025 3.025A3 3 0 1 1 6.99 6.768l3.026-3.026A3.01 3.01 0 0 1 8.411 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V9.589a3.011 3.011 0 0 1-1.742-1.604Z"/>
               </svg>
               </div>
              </th>
              <th scope="col" className="px-6 py-3">
              <div className='flex justify-center'>
                Download
                <svg className="ml-2  w-5 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
                </svg>
                </div>
              </th>
              <th scope="col" className="px-1 py-3 text-center">
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => {
              const { id, attributes } = item;
              let changeDate = attributes.date.slice(8,10) +'/'+ attributes.date.slice(5,7)+'/'+ attributes.date.slice(0,4);
              let createdAt =
                'Date : ' + attributes.createdAt.slice(8, 10)+'/'+ attributes.createdAt.slice(5,7)+'/'+ attributes.createdAt.slice(0,4) + ' , Time : ' + attributes.createdAt.slice(11, 18);
              return (
                <tr key={id} className=" border-b dark:bg-gray-800 dark:border-gray-700 text-center">
                <td className="text-gray-700 font-semibold text-center">{attributes.number}</td>
                <td className="text-gray-700 font-semibold text-center">{attributes.customer.data.attributes.companyName}</td>
                <td className="text-gray-700 font-semibold text-center">{changeDate}</td>
                <td className="text-gray-700 font-semibold text-center">{createdAt}</td>
                <td className="text-gray-700 font-semibold text-center">
                  <ButtonOpen invoiceId={id} lang={'en'} title={'English version'}/>
                  <ButtonOpen invoiceId={id} lang={'fr'} title={'French version'}/>
                </td>
                <td className="text-gray-700 font-semibold justify-center flex">
                  <ButtonDownload invoiceId={id} lang={'en'} title={'English version'}/>
                  <ButtonDownload invoiceId={id} lang={'fr'} title={'French version'}/>
                </td>
                <td className='text-center'>
                <button className='hover:text-white px-1 py-1 hover:rounded-md hover:bg-gray-400' onClick={()=>handleDelete(id,attributes.customer.data.id)}> 
                  <BsFillTrashFill/>
                </button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex mt-2 justify-center">
        <nav aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px text-sm mt-3">
            <li>
              <button
                onClick={handlePreviousPage} 
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-black font-medium bg-gray-200 border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </button>
            </li>
            {Array.from({ length: Math.ceil(filteredData.length / invoicesPerPage) }).map((_, i) => (
              <li key={i}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  disabled={currentPage === i+ 1}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-900 font-mrdium bg-gray-100 border border-gray-300 ${
                    currentPage === i + 1
                      ? 'text-gray-800 bg-gray-100'
                      : 'hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredData.length / invoicesPerPage)}
                className="flex items-center justify-center px-3 h-8 leading-tight text-black font-medium bg-gray-200 border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
        </div>
      </div>
    </div>
  );
}

