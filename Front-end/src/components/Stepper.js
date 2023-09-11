import { useEffect, useState, useRef } from "react";

export default function Stepper({ steps, currentStep }) {
  const [newStep, setNewStep] = useState([]);
  const stepRef = useRef();

  const updateStep = (stepNumber, steps) => {
    const newSteps = [...steps];
    let count = 0;

    while (count < newSteps.length) {
      // current step
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: true,
          selected: true,
          completed: true,
        };
        count++;
      }
      // step completed
      else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: true,
          completed: true,
        };
        count++;
      }
      // step pending
      else {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: false,
          completed: false,
        };
        count++;
      }
    }
    return newSteps;
  };

  useEffect(() => {
    // Create object
    const stepState = steps.map((step, index) =>
      Object.assign({}, {
        description: step,
        completed: false,
        highlighted: index === 0 ? true : false,
        selected: index === 0 ? true : false,
      }, [steps, currentStep])
    );

    stepRef.current = stepState;
    const current = updateStep(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  return (
    <ol className="flex items-center w-full mb-4 sm:mb-5">
      {newStep.map((step, index) => (
        <div
          key={index}
          className={
            index === 0
              ? "w-full flex items-center mt-6"
              : index === newStep.length - 1
              ? "w-full flex items-center mt-6"
              : "w-full flex items-center mt-6"
          }
        >
          <div
            className={`flex-1 ${
              index === newStep.length - 1 ? "mr-6" : "mx-6"
            } relative flex flex-col items-center text-gray-400 font-medium`}
          >
            <div
              className={`rounded-full transition duration-500 ease-in-out border-2 border-gray-300 h-12 w-12 flex items-center justify-center py-3
        ${step.selected ? "bg-gray-500 text-white font-bold border border-gray-500" : ""}`}
            >
              {/* Display Number */}
              {step.completed ? (
                <span className="text-white font-bold text-xl">&#10003;</span>
              ) : (
                index + 1
              )}
            </div>
            <div
              className={`absolute top-0 text-center mt-16 w-32 text-xs font-medium uppercase 
              ${step.highlighted ? "text-gray-900" : "text-gray-400"}`}
            >
              {/* Display Description */}
              {step.description}
            </div>
          </div>
          {index < newStep.length - 1 && (
            <div
              className={`flex-auto border-t-2 transition duration-500 ease-in-out 
             ${step.completed ? "border-gray-500" : "border-gray-300"}`}
            >
            </div>
          )}
        </div>
      ))}
    </ol>
  );
}
