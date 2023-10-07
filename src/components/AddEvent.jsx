import { useRef, useState } from "react";
import "./AddEvent.css";
import { useDispatch } from "react-redux";
import { fetchData } from "../../redux/slice";

const AddEvent = ({ setOpenAddEvent }) => {
  const inputFields = [
    { label: "ID", name: "id" },
    { label: "FG Item", name: "fgItem" },
    { label: "Production Line", name: "productionLine" },
    { label: "Date", name: "date" },
    { label: "Status", name: "status" },
    { label: "Plan Start", name: "planStart" },
    { label: "Plan End", name: "planEnd" },
    { label: "Plan Quantity (cases)", name: "planQuantityCases" },
    { label: "Plan Quantity (units)", name: "planQuantityUnits" },
    { label: "FG Name", name: "fgName" },
    { label: "Lot Code", name: "lotCode" },
    { label: "Actual Start", name: "actualStart" },
    { label: "Actual End", name: "actualEnd" },
    { label: "Actual Quantity (cases)", name: "actualQuantityCases" },
    { label: "Actual Quantity (units)", name: "actualQuantityUnits" },
    { label: "Labor Cost", name: "laborCost" },
    { label: "Labor per Unit", name: "laborPerUnit" },
    { label: "Fees - Per Unit", name: "feesPerUnit" },
    { label: "Fees - Per Run", name: "feesPerRun" },
    { label: "Item Spec", name: "itemSpec" },
    { label: "Ingredient Yield", name: "ingredientYield" },
    { label: "Packaging Yield", name: "packagingYield" },
    { label: "Generate Usage Report", name: "generateUsageReport" },
    { label: "Generate Production Report", name: "generateProductionReport" },
    { label: "Production Labor", name: "productionLabor" },
    { label: "Total Labor Hours", name: "totalLaborHours" },
  ];

  const dispatch = useDispatch();

  const [errorMessages, setErrorMessages] = useState({});
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);

  const refs = inputFields.reduce((acc, field) => {
    acc[field.name] = useRef(null);
    return acc;
  }, {});

  function handleCancel() {
    setOpenAddEvent(false);
  }

  function handleSubmit() {
    setIsLoadingAdd(true);
    const values = inputFields.map((field) => refs[field.name].current.value);
    const newErrorMessages = {};

    inputFields.forEach((field) => {
      if (!refs[field.name].current.value) {
        newErrorMessages[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    if (isLoadingAdd) return;
    sendDataToSheet(values);
    dispatch(fetchData());
    setOpenAddEvent(false);
  }

  async function sendDataToSheet(data) {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec",
        {
          method: "POST",
          body: JSON.stringify(data),
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoadingAdd(false);
    } catch (error) {
      console.error("Error sending data to sheet:", error);
    }
  }

  return (
    <div
      id="editMemberModal"
      className="relative z-10 ml-[40px]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[600px] sm:my-8 sm:p-6">
            <div className="mt-3 text-center sm:mt-5 text-sm montserrat">
              <h3
                className=" font-semibold lg:text-base leading-6 text-gray-900"
                id="modal-title"
              >
                Add Event
              </h3>
              <p className="text-base">Complete the fields to add new event.</p>
            </div>
            <div className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none">
              {inputFields.map((field) => (
                <div
                  key={field.name}
                  className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none"
                >
                  <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                    {field.label}
                  </label>
                  {field.name === "date" ? (
                    <input
                      ref={refs[field.name]}
                      name={field.name}
                      type="date"
                      className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] date-input"
                    />
                  ) : field.name.includes("Start") ||
                    field.name.includes("End") ? (
                    <input
                      ref={refs[field.name]}
                      name={field.name}
                      type="time"
                      className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px]"
                    />
                  ) : (
                    <input
                      ref={refs[field.name]}
                      name={field.name}
                      id={
                        "edit" +
                        field.name.charAt(0).toUpperCase() +
                        field.name.slice(1)
                      }
                      type="text"
                      className="bg-white ring-1 ring-gray-300 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px]"
                      placeholder={`Insert ${field.label.toLowerCase()}`}
                    />
                  )}
                  <span className="text-red-500">
                    {errorMessages[field.name]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              <button
                className="w-[120px] mr-2 rounded-lg bg-transparent px-3 py-2 border-2 border-indigo-600 text-base font-semibold text-indigo-600 shadow-sm hover:text-[#535787]"
                onClick={handleSubmit}
              >
                {isLoadingAdd ? (
                  <div
                    className="spinner inline-block w-2 h-2 ml-2 border-t-2 border-solid rounded-full animate-spin"
                    style={{
                      borderColor: "#535787",
                      borderRightColor: "transparent",
                      width: "1.2rem",
                      height: "1.2rem",
                    }}
                  ></div>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                className="w-[120px] mr-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold lg:text-sm text-white shadow-sm hover:bg-[#535787]"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
