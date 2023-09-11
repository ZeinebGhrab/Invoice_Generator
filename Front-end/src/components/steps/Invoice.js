import { useState,useEffect } from "react";
import {BsFillTrashFill} from 'react-icons/bs';
import axios from "axios";

export default function Invoice({handleClick,setInvoiceData,invoiceData}){

    const[date,setDate]=useState(invoiceData.date);
    const[number,setNumber]=useState(invoiceData.number);
    const currentDate= new Date();
    const [creationInvoiceYear,setCreationInvoiceYear] = useState(invoiceData.creationInvoiceYear === undefined ? currentDate.getUTCFullYear(): invoiceData.creationInvoiceYear);
    const[showAlertDate,setShowAlertDate]=useState(false)
    const[showAlertNumber,setShowAlertNumber]=useState(false)
    const[showAlertYear,setShowAlertYear]=useState(false)
    const[showAlertItems,setShowAlertItems]=useState(false)
    const[showRemoveMessageItem,setShowRemoveMessageItem]=useState(false)
    const[showRemoveMessageAdditional,setShowRemoveMessageAdditional]=useState(false)
    
    useEffect(() => {
      if(!number) {
      getLastNumberAndSet();
      }
    }, []);
  
     //Function get Last Customer Reference
  const getLastNumberAndSet = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("http://localhost:1337/api/Invoices?pagination[page]=1&pagination[pageSize]=1&sort[0]=number:desc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const { id,attributes } = res.data.data[0];
      setNumber( !isNaN(parseInt(attributes.number) + 1 ) ? parseInt(attributes.number) + 1 : 1 )
    } catch (error) {
      console.log(error);
    }
  };
  

  //---------Additional Invoice Fees---------------

  const[additionalInvoiceFees,setAdditionalInvoiceFees]=useState((invoiceData.additionalInvoiceFees === undefined || invoiceData.additionalInvoiceFees === []) ? [{
    titleFees:"",
    valueFees:0,
  }] : invoiceData.additionalInvoiceFees) 
    
  //Function additional Invoice Fees
  const addNewAdditional=(e)=>{
    e.preventDefault()
    const newData={title:"",value:0}
    setAdditionalInvoiceFees([...additionalInvoiceFees,newData])
  }

  //Function add all the additional invoices Fees data
  const addTitleFees=(title,index)=>{
    let data = additionalInvoiceFees;
    data = data.map((el,i)=>{
     if(i === index) {
       el.title=title;
     }
     return el
    })
    setAdditionalInvoiceFees([...data]);
    }

    const addValueFees=(value,index)=>{
    let data = additionalInvoiceFees;
    data = data.map((el,i)=>{
     if(i === index) {
       el.value=value;
     }
     return el
    })
    setAdditionalInvoiceFees([...data]);
    }

    //Function filter additional invoices fees
    const filterAdditional = () => {
      const filteredAdditional = additionalInvoiceFees.filter(add => add.title !== "" && add.value !== 0);
      console.log("filteredAdditional : ",filteredAdditional);
      return filteredAdditional;
    };

     //Function remove additional invoices fees
  const removeAdditional = (index) => {
    const filteredData = additionalInvoiceFees.filter((el, i) => {
      if (i !== index) {
        return el;
      }
    });
    setAdditionalInvoiceFees([...filteredData]);
  };

  //Function remove Item and show remove message
  const handleRemoveAdditional = (index) => {
    removeAdditional(index);
    setShowRemoveMessageAdditional(true); 
  };


    //-------------Items----------------
    
    const[items,setItems]=useState(invoiceData.items === undefined ? [{
      designation: "",
      quantity: 0,
      unitPrice:0,
      discount:0,
      taxPercentage:0,
    }] : invoiceData.items);

    //Function add new Item
    const addNewItem=(e)=>{
      e.preventDefault()
      const newData={designation: "",quantity: 0,unitPrice:0,discount:0,taxPercentage:0,}
      setItems([...items,newData])
    }

    //Function remove Item
  const removeItem = (index) => {
    const filteredData = items.filter((el, i) => {
      if (i !== index) {
        return el;
      }
    });
    setItems([...filteredData]);
  };

  //Function remove Item and show remove message
  const handleRemoveItem = (index) => {
    removeItem(index);
    setShowRemoveMessageItem(true); 
  };

  //Function add all the item data
    const addDesignation=(designation,index)=>{
      let data = items;
      data = data.map((el,i)=>{
       if(i === index) {
         el.designation=designation;}
       return el});
    setItems([...data]);
      }

    const addQuantity=(quantity,index)=>{
        let data = items;
        data = data.map((el,i)=>{
         if(i === index) {
           el.quantity=quantity;}
         return el});
        setItems([...data]);
        }

    const addUnitPrice=(unitPrice,index)=>{
        let data = items;
        data = data.map((el,i)=>{
          if(i === index) {
           el.unitPrice=unitPrice;}
           return el})
          setItems([...data]);
          }

    const addDiscount=(discount,index)=>{
        let data = items;
        data = data.map((el,i)=>{
          if(i === index) {
               el.discount=discount;}
             return el})
            setItems([...data]);
            }

    const addTaxPercentage=(taxPercentage,index)=>{
        let data = items;
         data = data.map((el,i)=>{
            if(i === index) {
                 el.taxPercentage =taxPercentage;}
               return el})
              setItems([...data]);
              }

    //Function filter items
    const filterItems = () => {
        const filteredItems = items.filter(item => item.designation!== "" && item.quantity !== 0 
        && item.unitPrice!== 0);
        console.log("Filtered Items: ",filteredItems);
         return filteredItems;
    };    

 // Verify all fields 
    const verify=()=>{
      if ((date !==undefined && date !=="") && (number!=="" && number !== undefined) && (items[0].designation!== "" && items[0].quantity !== 0 
      && items[0].unitPrice!== 0) && (creationInvoiceYear!== undefined && creationInvoiceYear !=="")){
        return true;  
       }
       else {
        setShowAlertNumber(number =="" || number === undefined ? true : false);
        setShowAlertDate(date === undefined || date ==="" ? true : false);
        setShowAlertItems((items[0].designation=== "" || items[0].quantity === 0 
        || items[0].unitPrice === 0 ) ? true : false);
        setShowAlertYear(creationInvoiceYear === undefined || creationInvoiceYear ==="" ? true : false);
       }
    }

    //Function back step
    const handleBackStep=()=>{
      handleClick("back");
      setInvoiceData({
        ...invoiceData,
        date,
        number,
        creationInvoiceYear,
        items:filterItems(),
        additionalInvoiceFees:filterAdditional(),
      });
      console.log(number);
      console.log(invoiceData.items );
    }

    //Function next step
    const handleNextStep = () => {
      verify();
    const verifcationResult=verify();
    if (verifcationResult===true){
      handleClick("next");
      setInvoiceData({
        date,
        number,
        creationInvoiceYear,
        items:filterItems(),
        additionalInvoiceFees:filterAdditional(),
      });
    }
    };
  

    return(
        <div>
      {/*The invoice data*/}
      <fieldset className="border border-red-600 p-3 rounded-lg" >
      <legend className="text-xl font-serif text-red-700"> The Invoice Information </legend>
        <label htmlFor="date" className="block p-1 text-m font-serif text-gray-900 dark:text-white"> Date :</label>
        <input value={date} id="date" className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the date" type="date"  onChange={(e) => setDate(e.target.value)}/>
        {showAlertDate && (
        <div className="m-1 p-3 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span class="font-medium">Required!</span> Enter the invoice date.
        </div>
        )}
        <label htmlFor="number" className="block p-1 text-m font-serif text-gray-900 dark:text-white"> Number :</label>
        <input value={number} id="number" className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a number" type="number"  onChange={(e) => setNumber(e.target.value)}/>
        {showAlertNumber && (
        <div className="m-1 p-3 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span className="font-medium">Required!</span> Enter the invoice number.
        </div>
        )}
        <label htmlFor="crea" className="block p-1 text-m font-serif text-gray-900 dark:text-white">Creation year :</label>
    <input value={creationInvoiceYear} id="crea" className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number" placeholder="Enter the Invoice creation year" onChange={(e) => setCreationInvoiceYear(e.target.value)}/>
    {showAlertYear && (
        <div className="m-1 p-3 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span className="font-medium">Required!</span> Enter the creation Invoice Year.
        </div>
        )}
       
       {/* the items data*/}
       
       <fieldset className="p-3 border border-gray-500 rounded-lg mb-2">
  <legend className="text-m font-serif text-gray-800 p-1">Item Details</legend>
  {/* Show remove message*/}
  {showRemoveMessageItem && (
           <div id="toast-danger" class="flex items-center w-full max-w-xs p-2 mb-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        <span className="sr-only">Error icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">Item has been deleted.</div>
    <button onClick={()=>{setShowRemoveMessageItem(false)}} type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
</div>
        )}
 <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-2">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr className="text-center font-serif">
        <th scope="col" className="px-6 py-3">#</th>
        <th scope="col" className="px-6 py-3">Designation</th>
        <th scope="col" className="px-6 py-3">Quantity</th>
        <th scope="col" className="px-6 py-3">Unit Price</th>
        <th scope="col" className="px-6 py-3">Tax Percentage % </th>
        <th scope="col" className="px-6 py-3">Discount %</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      {items.map((item, i) => (
        <tr className=" border-b dark:bg-gray-800 dark:border-gray-700 text-center">
          <td className="px-4 py-1 font-semibold">
            {i+1}
          </td>
          <td className="px-4 py-1">
            <input value={item.designation} id="designation" className="bg-slate-50 border border-gray-400 text-gray-900 text-s rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-6/7 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the designation" type="text" onChange={(e) => addDesignation(e.target.value, i)} />
          </td>
          <td className="px-4 py-1">
          <input value={item.quantity} id="quantity" min="0" className="bg-slate-50 border border-gray-400 text-gray-900 text-s rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-6/7 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the quantity" type="number" onChange={(e) => addQuantity(e.target.value, i)} />
          </td>
          <td className="px-4 py-1">
          <input value={item.unitPrice} id="unitprice" min="0" className="bg-slate-50 border border-gray-400 text-gray-900 text-s rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-6/7 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the unit Price" type="number" onChange={(e) => addUnitPrice(e.target.value, i)} />
          </td>
          <td className="px-4 py-1">
          <input value={item.taxPercentage} id="taxPercentage" min="0" className="bg-slate-50 border border-gray-400 text-gray-900 text-s rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-6/7 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the tax percentage" type="number" onChange={(e) => addTaxPercentage(e.target.value, i)} />
          </td>
          <td className="px-4 py-1">
          <input defaultValue={item.discount} id="discount" min="0" className="bg-slate-50 border border-gray-400 text-gray-900 text-s rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-6/7 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the discount" type="number" onChange={(e) => addDiscount(e.target.value, i)} />
          </td>
        <td>
          {/* Button remove Item data */}
        <button
        className="hover:text-white border  hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg px-1 py-1 text-lg text-center mr-2 mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
      onClick={() => handleRemoveItem(i)}>
        <BsFillTrashFill/>
        </button>
        </td>
        </tr>
          ))}
      </tbody>
      </table>
  {showAlertItems && (
<div class="m-1 p-3 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
<span class="font-medium">Required!</span> Enter at least one item.
</div>
)}
  {/*Button add new Item */}
  <button onClick={addNewItem} className="text-red-700 hover:text-white border border-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-2 py-1 text-xs text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">+ Line Item</button>
</fieldset>
  
      {/* Aditionnal invoices fees information */}
      
      <fieldset className="p-3 border border-gray-500 rounded-lg mb-2">
          <legend className="text-m font-serif text-gray-800 p-1"> Additional Invoice Fees Details </legend>
          {/* Show remove message*/}
  {showRemoveMessageAdditional && (
           <div id="toast-danger" class="flex items-center w-full max-w-xs p-2 mb-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        <span className="sr-only">Error icon</span>
    </div>
    <div className="ml-3 text-sm font-normal">Additional invoices fees has been deleted.</div>
    <button onClick={()=>{setShowRemoveMessageAdditional(false)}} type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
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
        <th scope="col" className="px-6 py-3">#</th>
        <th scope="col" className="px-6 py-3">Title</th>
        <th scope="col" className="px-6 py-3">Value</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      {additionalInvoiceFees.map((fees,i)=>
            <tr className=" border-b dark:bg-gray-800 dark:border-gray-700 text-center">
              <td className="px-6 py-1 font-semibold">
                {i+1}
              </td>
              <td className="px-6 py-1">
              <input value={fees.title} id="titleFees" className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the title" type="text" onChange={e=>addTitleFees(e.target.value,i)}/>
              </td>
              <td className="px-6 py-1">
              <input value={fees.value} id="valueFees" min="0" className="bg-slate-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the value" type="number" onChange={e=>addValueFees(e.target.value,i)}/>
              </td>
            <td className="text-right"> 
  {/* Button remove additional data */}
     <button
      className="hover:text-white border  hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg px-1 py-1 text-lg text-center mr-2 mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
      onClick={() => handleRemoveAdditional(i)}>
      <BsFillTrashFill/>
    </button>
    </td>
    </tr>
          )}
   </tbody>
      </table>
          <button onClick={addNewAdditional} className="text-red-700 hover:text-white border border-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-2 py-1 text-xs text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">+ Line Additional Invoice Fees</button>
      </fieldset>
      <div className="flex justify-between mt-2">
      <button onClick={handleBackStep} className="bg-slate-200 text-slate-600 uppercase py-3 px-5 rounded-xl font-semibold cursor-pointer
              border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out">Back</button>
      <button onClick={handleNextStep} className="bg-gray-600 text-white uppercase py-3 px-5 rounded-xl font-semibold cursor-pointer
            hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out">Next</button>
            </div>
            </fieldset>
</div> )
}