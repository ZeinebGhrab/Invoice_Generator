import {useState,useEffect} from 'react';
import axios from "axios";

export default function CustomerModal({closeModal,customerData,setCustomerData}){
    
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [existingCompanies,setExistingCompanies]=useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCompanyData(token);
      handleSelectCompany(token);
    } 
    
  }, []);
  
  //Function get customer data
  const getCompanyData=async()=>{
    try{
      const token = localStorage.getItem('token')
      const res = await axios.get("http://localhost:1337/api/Customers",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExistingCompanies(res.data.data);
      console.log(existingCompanies);
    }
    catch(error){
      console.log(error);
    }
  } 

  // Function select company Name
  const handleSelectCompany = async (companyId) => {
    setSelectedCompanyId(companyId);
    console.log("company ID :", companyId);
  }

  //function handle next
const confirm=async()=>{
  try{

  const req="http://localhost:1337/api/Customers/"+selectedCompanyId+"/?populate[companyData]=*";
    const token = localStorage.getItem('token')
    const res= await axios.get(req,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCustomerData({
  companyName:res.data.data.attributes.companyName,
  ref:res.data.data.attributes.ref,
  language:res.data.data.attributes.language,
  currency:res.data.data.attributes.currency,
  country:res.data.data.attributes.country,
  companyData:res.data.data.attributes.companyData,
  creationCustomerYear:res.data.data.attributes.creationYear,
});
closeModal(false)
}
catch(error){
  console.log(error);
}
}
     return(
        <div className="absolute top-12 right-0 w-[350px] h-[350px] bg-gray-300 bg-opacity-25 backdrop-blur-sm justify-center items-center ">
        <div className="flex items-start justify-between p-2 border-b rounded-t border-gray-400">
                <button onClick={()=>{closeModal(false)}} type="button" className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
        <label className="items-center justify-center ml-1 block p-2 text-m font-serif text-gray-900 dark:text-white mt-7"> Select an existing Company :</label>
            <select className="ml-2 mr-9 bg-gray-100 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[300px] p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => handleSelectCompany(e.target.value)}>
            <option className="text-black font-bold" selected>Choose</option>
        {existingCompanies.map((company) => {
          const { id, attributes } = company;
          return (
            <>
            <option key={id} value={id} className="font-serif mb-3">
              {attributes.companyName}
            </option>
            </>   
          );
        })}
      </select>
      <div className="flex justify-center mt-12 mr-2">
      <button className=" bg-gray-600 text-white uppercase py-2.5 px-5 rounded-xl font-semibold cursor-pointer hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out" onClick={confirm}>confirm</button>
      </div>
        </div>   
      )
}
