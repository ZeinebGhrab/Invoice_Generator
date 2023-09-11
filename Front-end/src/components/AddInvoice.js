import { useState } from "react";
import Customer from "./steps/Customer";
import Invoice from "./steps/Invoice";
import Download from "./steps/Download";
import Stepper from "./Stepper";
import zetaImage from './zeta.png';

export default function AddInvoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const steps = ["Customer Information", "Invoice Information", "Complete"];

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <Customer customerData={customerData} setCustomerData={setCustomerData} handleClick={handleClick}/>;
      case 2:
        return <Invoice invoiceData={invoiceData} setInvoiceData={setInvoiceData} handleClick={handleClick} />;
      default:
        return <Download customerData={customerData} setCustomerData={setCustomerData}
        invoiceData={invoiceData} setInvoiceData={setInvoiceData}
         handleClick={handleClick} />;
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;
    direction === "next" ? (newStep++) : (newStep--);
    // Check if steps are within bounds
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  return (
    <div style={{
      backgroundImage: `url(${zetaImage})`,
      backgroundSize: '99% 99%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '120vh',
    }}>
      <div className="md:w-1/2 mx-auto shadow-xl rounded-2xl pb-1 bg-slate-50">
        <div className="container horizontal mt-5 mb-12 ml-7 ">
          {/* Stepper */}
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      </div>
      {/* Display Components */}
      <div className="my-3 p-4 w-11/12 mx-auto m-11/12" >
          {displayStep(currentStep)}
      </div>
    </div>
  );
}

