import axios from "axios";
import React, { useState} from 'react';

export default function ButtonOpen({invoiceId, language,title}){

  const [isOpening, setIsOpening]=useState(false)
  const [isDownloading, setIsDownloading] = useState(false);

    //Open Invoice
  const openInvoice = async (invoiceId, language) => {
    try {
      let lang = language === "FRENCH" ? "fr" : "en";
      let url = `http://localhost:1337/api/print-invoice/${invoiceId}?lang=${lang}`;
      console.log("URL:", url);

      const response = await axios.get(url, { responseType: 'blob' });
      console.log("Response:", response);

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");

      console.log("Invoice opened successfully");

    } catch (error) {
      console.log("Open error:", error);
    }
  };
  const verifyTitle = title ==="Open Invoice" ? true : false;
  //Function Open Invoice
  const handleOpenInvoice = async (e) => {
    e.preventDefault();
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
    }, 2500);
    
    openInvoice(invoiceId,language);
  };
  
  return(
    <>   
    {verifyTitle ?(
    <button
    disabled={isOpening}
    onClick={handleOpenInvoice}
    className="py-3 px-3 text-sm font-medium text-white bg-red-600 rounded-lg border border-gray-200 hover:bg-red-500 hover:text-white focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
  >
    <svg aria-hidden="true" role="status" className={`inline w-4 h-4 mr-2 text-gray-200 ${isOpening ? 'animate-spin dark:text-gray-600' : 'dark:text-gray-400'} ${isDownloading ? 'spin-image' : ''}`} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
   <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
   </svg>
   <div className="flex">
   <span className={`${isOpening ? 'animate-pulse' : ''}`}>{title}
  </span>
   <svg className="ml-1.5 w-4 h-4 mt-0.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                <path d="M17 0h-5.768a1 1 0 1 0 0 2h3.354L8.4 8.182A1.003 1.003 0 1 0 9.818 9.6L16 3.414v3.354a1 1 0 0 0 2 0V1a1 1 0 0 0-1-1Z"/>
               <path d="m14.258 7.985-3.025 3.025A3 3 0 1 1 6.99 6.768l3.026-3.026A3.01 3.01 0 0 1 8.411 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V9.589a3.011 3.011 0 0 1-1.742-1.604Z"/>
               </svg>
   </div>
  </button>
  ) : (
    <button
    disabled={isOpening}
    onClick={handleOpenInvoice}
    className="mt-2 text-red-700 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-1 py-2 text-xs text-center mr-1 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 "
  >
    <svg aria-hidden="true" role="status" className={`inline w-4 h-4 mr-2 text-gray-200 ${isOpening ? 'animate-spin dark:text-gray-600' : 'dark:text-gray-400'} ${isDownloading ? 'spin-image' : ''}`} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
   <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
   </svg>
  <span className={`${isOpening ? 'animate-pulse' : ''}`}>{title}</span>
  </button>
  )
}
   </>
  )
}