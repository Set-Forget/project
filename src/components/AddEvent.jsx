import { useEffect, useRef, useState } from "react";
import "./AddEvent.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLocations, fetchData } from "../../redux/slice";
import Select from "react-select";

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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
      borderWidth: "1px",
      borderColor: "gray",
      // boxShadow: '0 0 10px rgba(102, 169, 255, 0.5)', // approx. for focus:drop-shadow-2xl
      // padding: '12px 16px', // approx. for px-4 py-2
      borderRadius: "0.375rem", // for rounded-md
      outline: "indigo-600",
      height: "40px", // sm:h-[60px]
      cursor: "pointer",
      "&:hover": {
        borderColor: "gray", // ring on hover
      },
      "&:focus": {
        borderColor: "#4f46e5",
        boxShadow: "0 0 10px rgba(102, 169, 255, 0.5)", // for focus:outline-indigo-600 + drop-shadow
        outline: "#4f46e5",
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "gray-400",
    }),
    // Add other styles as necessary
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, []);

  const { allLocations } = useSelector((state) => state.reducer);

  const [errorMessages, setErrorMessages] = useState({});
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [selectedFGItem, setSelectedFGItem] = useState(null);

  const refs = inputFields.reduce((acc, field) => {
    acc[field.name] = useRef(null);
    return acc;
  }, {});

  function handleCancel() {
    setOpenAddEvent(false);
  }

  function generateRandomID(length = 8) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  function handleSubmit() {
    setIsLoadingAdd(true);

    const formattedValues = {};
    inputFields.forEach((field) => {
      formattedValues[field.name] = "";
    });

    const newErrorMessages = {};
    inputFields
      .filter((field) => fieldsToRender.includes(field.name))
      .forEach((field) => {
        if (field.name === "fgItem") {
          if (!selectedFGItem) {
            newErrorMessages[field.name] = `${field.label} is required`;
          } else {
            formattedValues[field.name] = selectedFGItem.value;
          }
        }
        if (
          !refs[field.name].current.value &&
          [
            "date",
            "productionLine",
            "planStart",
            "planEnd",
            "planQuantityCases",
          ].includes(field.name)
        ) {
          newErrorMessages[field.name] = `${field.label} is required`;
        } else {
          if (field.name === "fgItem") {
            formattedValues[field.name] = selectedFGItem
              ? selectedFGItem.value
              : ""; // Use the value from react-select state
          }
          if (
            [
              "date",
              "productionLine",
              "planStart",
              "planEnd",
              "planQuantityCases",
            ].includes(field.name)
          ) {
            formattedValues[field.name] = refs[field.name].current.value;
          }
        }
      });

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    const matchingLocation = allLocations.find(
      (location) => location[2] === formattedValues.fgItem
    )[0];

    formattedValues.id = generateRandomID();
    formattedValues.status = "Scheduled";
    formattedValues.fgName = formattedValues.fgItem;
    formattedValues.fgItem = matchingLocation;

    sendDataToSheet(Object.values(formattedValues));
    dispatch(fetchData());
    setOpenAddEvent(false);
    setIsLoadingAdd(false);
  }

  async function sendDataToSheet(data) {
    try {
      await fetch(
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
    } catch (error) {
      console.error("Error sending data to sheet:", error);
    }
  }

  const fieldsToRender = [
    "date",
    "productionLine",
    "fgItem",
    "planStart",
    "planEnd",
    "planQuantityCases",
  ];

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
              {inputFields
                .filter((field) => fieldsToRender.includes(field.name))
                .map((field) => (
                  <div
                    key={field.name}
                    className="flex flex-col gap-4 w-full py-2 text-gray-500 px-1 outline-none"
                  >
                    <label className="mt-4 text-left montserrat text-gray-700 font-semibold lg:text-sm text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                      {field.label}
                    </label>
                    {field.name === "fgItem" ? (
                      <Select
                        options={allLocations?.map((option) => ({
                          value: option[2],
                          label: option[2],
                        }))}
                        value={selectedFGItem}
                        onChange={(selectedOption) =>
                          setSelectedFGItem(selectedOption)
                        }
                        isSearchable={true}
                        styles={customStyles}
                        placeholder={`Select ${field.label.toLowerCase()}`}
                        ref={refs[field.name]}
                        name={field.name}
                      />
                    ) : field.name === "productionLine" ? (
                      <select
                        ref={refs[field.name]}
                        name={field.name}
                        className="bg-white ring-[1px] ring-gray-100 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] date-input"
                      >
                        <option value="" selected disabled>Select product line</option>
                        <option value="1">P1</option>
                        <option value="2">P2</option>
                        <option value="3">P3</option>
                      </select>
                    ) : field.name === "date" ? (
                      <input
                        ref={refs[field.name]}
                        name={field.name}
                        type="date"
                        className="bg-white ring-[1px] ring-gray-100 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px] date-input"
                      />
                    ) : field.name.includes("Start") ||
                      field.name.includes("End") ? (
                      <input
                        ref={refs[field.name]}
                        name={field.name}
                        type="datetime-local"
                        className="bg-white ring-[1px] ring-gray-100 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px]"
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
                        className="bg-white ring-[1px] ring-gray-100 w-full rounded-md border border-gray-400 px-4 py-2 outline-none cursor-pointer focus:outline-indigo-600 focus:drop-shadow-2xl sm:h-[60px] lg:h-[40px]"
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
