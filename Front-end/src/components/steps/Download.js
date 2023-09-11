import React, { useState} from "react";
import {BsCheckCircleFill} from "react-icons/bs";
import axios from "axios";
import ButtonDownload from "../ButtonDownload";
import ButtonOpen from "../ButtonOpening";


export default function Download({handleClick,customerData,invoiceData}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const[isCompleted,setIsCompleted]=useState(false);
  const[invoiceId,setInvoiceId]=useState(null)
  
  
  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsCompleted(true);
    handleClick('next')
    try {
      // Function send the customer data 
      const resCustomerData = await axios.post("http://localhost:1337/api/Customers", {
        data: {
          companyName: customerData.companyName,
          companyData: customerData.companyData,
          ref: customerData.ref,
          creationYear:customerData.creationCustomerYear,
          currency: customerData.currency || "EUR",
          country: customerData.country || "TUNISIA",
          language: customerData.language || "FRENCH",
        }
      });

      // Function send the invoice data
      const resInvoiceData = await axios.post("http://localhost:1337/api/Invoices", {
        data: {
          number: invoiceData.number,
          creationYear:invoiceData.creationInvoiceYear, 
          date: invoiceData.date,     
          customer: resCustomerData.data.data.id,
          items: invoiceData.items,   
          additionalInvoiceFees: invoiceData.additionalInvoiceFees,
        }
      });

      console.log("Invoice Data : ", resInvoiceData.data);
      console.log("Customer Data", resCustomerData.data);
      console.log("Data has been sent");

      setIsConfirmed(true);
      console.log(resInvoiceData.data.data.id);
      setInvoiceId(resInvoiceData.data.data.id);
    } catch (error) {
      console.log("error: ", error);
    }
  };


    //Function back step
    const handleBackStep=()=>{
      handleClick("back");
    }

  return (
    <>
    <div >
      {!isConfirmed && (
        <>
        <div className="mt-11 mb-6 flex items-center justify-center">
          <div className="text-xl font-serif uppercase text-gray-500"> 
          Do you want to confirm ? 
          </div> 
          </div>
          <div className="mt-4 mb-6 flex items-center justify-center">
        <button
          onClick={handleConfirm}
          className="py-3 px-4 mr-2 text-sm font-bold text-white bg-red-700 rounded-lg border border-gray-200 hover:bg-red-500 hover:text-white focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
        >
          <svg aria-hidden="true" role="status" className={`inline w-4 h-4 mr-3 text-gray-200 dark:text-gray-400`} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
          </svg>
          <span>Confirm</span>
        </button>
        </div>
        </>
      )}
      {isConfirmed && (
        <>
        <div className="flex items-center justify-center mb-5 mt-11">
        <BsCheckCircleFill className="mt-3 mr-1 text-2xl text-green-600"/>
        <div className="mt-3 text-xl font-serif uppercase text-gray-500">
          Your Invoice has been created.
        </div>  
        </div>
        {/*Button open Invoice*/}
        <div className="flex items-center justify-center mb-3">
          <ButtonOpen invoiceId={invoiceId} lang={customerData.lang} title={'Open Invoice'}/>
          </div>
        {/*Button download Invoice */}
        <div className="flex items-center justify-center">
      <ButtonDownload invoiceId={invoiceId} lang={customerData.language} title={'Download Invoice'} />
          </div>
          </>
      )}
       </div>
      {!isCompleted &&(
        <button onClick={handleBackStep} className="fixed bottom-4 left-6 bg-white text-slate-400 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer
        border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ">Back</button>
      )}
      </>
  );
}