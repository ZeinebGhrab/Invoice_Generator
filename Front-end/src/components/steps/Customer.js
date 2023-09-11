import { useState,useEffect} from "react";
import {RiAddCircleLine} from 'react-icons/ri';
import {BsFillTrashFill} from 'react-icons/bs';
import CustomerModal from "./CustomerModal";
import axios from "axios";


export default function Customer({handleClick,customerData,setCustomerData}) {

  const currencies = ["TND", "EUR", "USD", "CAD"];
  const languages = ["FRENCH", "ENGLISH"];
  const countries = ["TUNISIA", "GERMANY", "FRANCE", "USA", "CANADA"];
  const [companyName, setCompanyName] = useState(customerData.companyName);
  const [currency, setCurrency] = useState(customerData.currency === undefined ?"TND" :customerData.currency);
  const [language, setLanguage] = useState(customerData.language === undefined ?"FRENCH" :customerData.language);
  const [country, setCountry] = useState(customerData.country === undefined ?"TUNISIA" :customerData.country);
  const currentDate= new Date();
  const [creationCustomerYear,setCreationCustomerYear] = useState(customerData.creationCustomerYear === undefined ? currentDate.getUTCFullYear(): customerData.creationCustomerYear);
  const [showAlertCompanyName, setShowAlertCompanyName] = useState(false);
  const [showAlertCompanyData,setShowAlertCompanyData]=useState(false);
  const [showAlertRef, setShowAlertRef] = useState(false);
  const [showAlertYear, setShowAlertYear] = useState(false);
  const [companyData, setCompanyData] = useState([{ title: "", value: "" }]);
  const [showRemoveMessage, setShowRemoveMessage] = useState(false);
  const [openModal, setOpenModal]=useState(false);
  const [ref, setRef] = useState(customerData.ref);

  useEffect(() => {
    if(!ref) {
      getLastRefAndSet()
    }
  }, [])

  //Function get Last Customer Reference
  const getLastRefAndSet = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("http://localhost:1337/api/Customers?pagination[page]=1&pagination[pageSize]=1&sort[0]=ref:desc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { id,attributes } = res.data.data[0];
      setRef((!isNaN(attributes.ref +1 )) ? parseInt(attributes.ref) + 1 : 1);
    } catch (error) {
      console.log(error);
    }
  };
  

  
  
  //Function add new company data
  const addNewCompanyData = (e) => {
    e.preventDefault();
    const newData = { title: "", value: "" };
    setCompanyData([...companyData, newData]);
    console.log("company data", companyData);
  };
  const addTitle = (title, index) => {
    let data = companyData;
    data = data.map((el, i) => {
      if (i === index) {
        el.title = title;
      }
      return el;
    });
    setCompanyData([...data]);
  };
  const addValue = (value, index) => {
    let data = companyData;
    data = data.map((el, i) => {
      if (i === index) {
        el.value = value;
      }
      return el;
    });
    setCompanyData([...data]);
  };

  const filterCompanyData = () => {
    const filteredData = companyData.filter(data => data.title !== "" && data.value !== "");
    console.log("filteredData : ", filteredData);
    return filteredData;
  };

  //Function remove companyData
  const removeCompanyData = (index) => {
    const filteredData = companyData.filter((el, i) => {
      if (i !== index) {
        return el;
      }
    });
    setCompanyData([...filteredData]);
  };
 
  
  const handleRemove = (index) => {
    removeCompanyData(index);
    setShowRemoveMessage(true); 
  };

  // Verify all fields 
  const verify = () => {
    if ((companyName !== undefined && companyName !== "") && (ref !=="" && ref !==undefined) && (companyData[0].title !=="" && companyData[0].value !=="")) {
      return true;
    } else {
      setShowAlertCompanyName(companyName === undefined || companyName === "" ? true : false);
      setShowAlertCompanyData((companyData[0].title === "" || companyData[0].value ==="")? true : false);
      //setShowAlertYear(creationCustomerYear === undefined || creationCustomerYear ==="" ? true : false);
      setShowAlertRef(ref === "" || ref === undefined ? true : false);
    }
  };

  //Function next step
  const handleNextStep = () => {
    verify();
    const verifcationResult=verify();
    if (verifcationResult===true){
    handleClick("next");
    setCustomerData({
      ...customerData,
      companyName,
      companyData:filterCompanyData(),
      ref,
      creationCustomerYear,
      language,
      currency,
      country,
    });
  }
  };

  //Update 
  useEffect(() => {
    setCompanyName(customerData.companyName);
    setRef(customerData.ref);
    setCurrency(customerData.currency);
    setCountry(customerData.country);
    setLanguage(customerData.language)
    //setCreationCustomerYear(customerData.creationCustomerYear)
    setCompanyData(customerData.companyData === undefined ?  [{ title: "", value: "" }] : customerData.companyData );
  }, [customerData]);
    
  return( 
    <div>
  
  {/*the customer data*/}

  <fieldset className="border border-red-600 p-3 rounded-lg" >
  <legend className="text-red-700 text-xl font-serif "> The Customer Information </legend>
  <label htmlFor="company" className="block p-1 text-m font-serif text-gray-800 dark:text-white ">Company name :</label>
 <div className="flex justify-between space-x-2">
  <input id="company" value={companyName} className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="Enter your company Name " onChange={(e) => setCompanyName(e.target.value)}/>
 {/*Adding an existing company*/}
 <button  onClick={()=>setOpenModal(true)} className="text-red-700 hover:text-gray-400 font-semibold text-2xl text-center">
   <RiAddCircleLine/>
  </button>
  {openModal && <CustomerModal closeModal={setOpenModal} customerData={customerData} setCustomerData={setCustomerData} handleClick={handleClick}/> }
 </div>
 {showAlertCompanyName && (
<div className="m-1 p-3 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
<span className="font-medium">Required!</span> Enter a company name.
</div>
)}
    
  {/*the company data */}
  
  <fieldset className="border border-gray-500 p-3 rounded-lg">
    <legend className="text-m font-serif text-gray-800 p-1"> Company Details </legend>
    {/* Show remove message*/}
    {showRemoveMessage && (
           <div id="toast-danger" className="flex items-center w-full max-w-xs p-2 mb-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        <span className="sr-only">Error icon</span>
    </div>
    <div className="ml-3 text-sm font-normal">Company detail has been deleted.</div>
    <button onClick={()=>{setShowRemoveMessage(false)}} type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
</div>
        )}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-2">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr className="text-center font-serif">
        <th scope="col" className="px-2 py-2">#</th>
        <th scope="col" className="px-5 py-2">Title</th>
        <th scope="col" className="px-6 py-2">Value</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      {companyData.map((data, i) =>( 
    <tr className=" border-b dark:bg-gray-800 dark:border-gray-700 text-center">
      <td className="px-2 py-1 font-semibold">{i+1}</td>
      <td className="px-6 py-1">
        <input
          id="title"
          value={data.title}
          className="w-full mr-1 bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          placeholder="Enter the title"
          onChange={(e) => addTitle(e.target.value, i)}
        />
        </td>
      <td className="px-6 py-1">
      <input
          id="value"
          value={data.value}
          className="w-full mr-1 bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          placeholder="Enter the value"
          onChange={(e) => addValue(e.target.value, i)}
        />
        </td>
        <td className="text-right">
           {/* Button remove company data */}
          <button
            className="hover:text-white border  hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg px-1 py-1 text-lg text-center mr-2 mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
             onClick={() => handleRemove(i)} >
            <BsFillTrashFill/>
          </button>
        </td>  
    </tr>
   ))}
   </tbody>
      </table>
   
{showAlertCompanyData && (
<div className="m-1 p-3 mb-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
<span className="font-medium">Required!</span> Enter at least one company detail.
</div>
)}

  {/*Button add company data */}
    <button onClick={addNewCompanyData} className="text-red-700 hover:text-white border border-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-2 py-1 text-xs text-center mr-2 mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">+ Line Company Detail</button>
    </fieldset>

    <label htmlFor="ref" className="block p-1 text-m font-serif text-gray-900 dark:text-white">Reference :</label>
    <input value={ref} id="ref" className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number" placeholder="Enter the customer reference " onChange={(e) => setRef(e.target.value)}/>
    {showAlertRef && (
    <div className="m-1 p-3 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
    <span className="font-medium">Required!</span> Enter the customer reference.
    </div>
    )}
    <label htmlFor="crea" className="block p-1 text-m font-serif text-gray-900 dark:text-white">Creation year :</label>
    <input value={creationCustomerYear} id="crea" className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="Enter the customer creation year" onChange={(e) => setCreationCustomerYear(e.target.value)}/>
    {showAlertYear && (
        <div class="m-1 p-3 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span class="font-medium">Required!</span> Enter the creation Customer Year.
        </div>
        )}
    <label htmlFor="currency" className="block p-1 text-m font-serif text-gray-900 dark:text-white "> Currency :</label>
    <select value={currency} id="currency" className=" bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setCurrency(e.target.value)}>
    {currencies.map(e => (
      <option value={e} selected={e === "TND"}>{e}</option>))}   
    </select>
    <label htmlFor="country" className="block p-1 text-m font-serif text-gray-900 dark:text-white"> Country :</label>
    <select value={country} id="country" className=" bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setCountry(e.target.value)}>
    {countries.map(e => (
      <option selected={e === "TUNISIA"}>{e}</option>))} 
    </select>
    <label htmlFor="language" className="block p-1 text-m font-serif text-gray-900 dark:text-white"> Language :</label>
    <select value={language} id="language" className=" bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setLanguage(e.target.value)}>
    {languages.map(e => (
      <option value={e}>{e}</option>))} 
    </select>
  <div className="flex justify-end mt-2">
  <button onClick={handleNextStep} className="bg-gray-600 text-white uppercase py-3 px-5 rounded-xl font-semibold cursor-pointer
            hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out">Next</button>
  </div>
  </fieldset>      
  </div>
    )
}