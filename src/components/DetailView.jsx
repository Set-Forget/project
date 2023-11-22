import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useDispatch } from "react-redux";
import { fetchData } from "../../redux/slice";
import ConfirmDeleteEvent from "./ConfirmDeleteEvent";

function DetailView({ event, setIsModalVisible, data, setShouldUpdateData }) {
  let headers = data[0];
  let filteredEventData = data.filter((el) => el[0] == event)[0];

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  function formatTime(inputTime) {
    const date = new Date(inputTime);

    date.setUTCHours(date.getUTCHours() - 3);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${month}/${day}/${year} ${hours}:${minutes}:00`;
  }

  let formattedEventData = [...filteredEventData];
  formattedEventData[3] = formatDate(formattedEventData[3]);
  formattedEventData[5] = formatTime(formattedEventData[5]);
  formattedEventData[6] = formatTime(formattedEventData[6]);

  const [editPlanStart, setEditPlanStart] = useState(false);
  const [eventId, setEventId] = useState(event);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  // const [putTime, setPutTime] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modifiedData, setModifiedData] = useState({});

  const handleInputChange = (header, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [header]: newValue,
    }));

    setModifiedData((prevModifiedData) => ({
      ...prevModifiedData,
      [header]: newValue,
    }));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (deleteEventId == true) {
      const deletePost = async () => {
        setIsLoadingDelete(true);
        await deleteEvent(eventId);
        dispatch(fetchData());
        setDeleteEventId(false);
        setIsLoadingDelete(false);
        setEditPlanStart(false);
        setShouldUpdateData(true);
        setIsModalVisible(false);
      };
      deletePost();
    }
  }, [
    deleteEventId,
    isLoadingDelete,
    dispatch,
    editPlanStart,
    formattedEventData,
  ]);

  const handleDeleteEvent = () => {
    setConfirmModalVisible(true);
  };

  const handleSave = () => {
    setIsLoadingPost(true);
    putPlanTime(eventId, modifiedData);
    // setPutTime(false);
  };

  const onClose = () => {
    setIsModalVisible(false);
    setEditPlanStart(false);
  };

  const deleteEvent = async (eventId) => {
    try {
      let url = `https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec?action=deleteEvent&eventId=${eventId}`;

      await fetch(url, {
        mode: "no-cors",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  async function putPlanTime(eventId, modifiedValues) {
    let body = JSON.stringify({
      action: "updatePlanTime",
      eventId: eventId,
      modifiedValues: modifiedValues,
    });
    console.log("body", body);
    try {
      await fetch(
        `https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec`,
        {
          method: "POST",
          body: body,
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((resp) => {
        dispatch(fetchData());
        // setPutTime(true);
        setIsLoadingPost(false);
        setEditPlanStart(false);
        setIsModalVisible(false);
      });
    } catch (error) {
      console.error("Error sending data to sheet:", error);
    }
  }

  const headersMap = {
    Date: 3,
    "Production Line": 2,
    Item: 9,
    Status: 4,
    "Plan Quantity (cases)": 7,
    "Plan Start": 5,
    "Plan End": 6,
    "Lot Number": 10,
    "Actual Start": 11,
    "Actual End": 12,
    "Actual Quantity (cases)": 13,
  };

  const displayHeaders = [
    "Date",
    "Production Line",
    "Item",
    "Status",
    "Plan Quantity (cases)",
    "Plan Start",
    "Plan End",
    "Lot Number",
    "Actual Start",
    "Actual End",
    "Actual Quantity (cases)",
  ];

  // const formatDateEdit = (dateString) => {
  //   // Format the date (assuming dateString is in ISO format YYYY-MM-DD)
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-US", {
  //     timeZone: "UTC",
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //   });
  // };

  // const formatDateTimeEdit = (dateTimeString) => {
  //   // Format the datetime (assuming dateTimeString is in ISO format YYYY-MM-DDTHH:mm)
  //   const dateTime = new Date(dateTimeString);
  //   return dateTime.toLocaleString("en-US", {
  //     timeZone: "UTC",
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   });
  // };

  const formatDateEdit = (dateString) => {
    // Format the date as YYYY-MM-DD
    const date = new Date(dateString);
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
  };
  
  const formatDateTimeEdit = (dateTimeString) => {
    // Format the datetime as YYYY-MM-DDTHH:mm:ss
    const dateTime = new Date(dateTimeString);
    return `${dateTime.getUTCFullYear()}-${(dateTime.getUTCMonth() + 1).toString().padStart(2, '0')}-${dateTime.getUTCDate().toString().padStart(2, '0')}T${dateTime.getUTCHours().toString().padStart(2, '0')}:${dateTime.getUTCMinutes().toString().padStart(2, '0')}:${dateTime.getUTCSeconds().toString().padStart(2, '0')}`;
  };
  
  const [formData, setFormData] = useState(() => {
    const initialFormData = {};

    displayHeaders.forEach((header) => {
      const index = headersMap[header];
      let value = formattedEventData[index];

      if (header === "Date" && value) {
        const date = new Date(value);
        value = formatDate(date);
      } else if (header.includes("Start") || header.includes("End") && value) {
        const dateTime = new Date(value);
        value = formatTime(dateTime);
      }

      initialFormData[header] = value;
    });

    return initialFormData;
  });

  return (
    <div
      className="relative z-10 ml-[40px]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            // onMouseLeave={() => setIsModalVisible(false)}
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[600px] sm:my-8 sm:p-6"
          >
            {confirmModalVisible && (
              <ConfirmDeleteEvent
                setIsLoadingDelete={setIsLoadingDelete}
                setDeleteEventId={setDeleteEventId}
                setConfirmModalVisible={setConfirmModalVisible}
              />
            )}
            {isLoadingDelete == false ? (
              <>
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex -mt-4 justify-end">
                    {editPlanStart == false ? (
                      <button
                        type="button"
                        onClick={() => setEditPlanStart(true)}
                        className="w-32 rounded-md mr-2 bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:border hover:border-indigo-500"
                      >
                        Edit Plan Start
                      </button>
                    ) : isLoadingPost ? (
                      // Spinner
                      <div className="w-32 rounded-md ml-2 -mt-4 flex justify-center items-center">
                        <Spinner />
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="w-24 rounded-md mr-2 bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:border hover:border-indigo-500"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteEvent}
                          className="w-28 rounded-md mr-2 bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:border hover:border-indigo-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {isLoadingPost ? (
                      <button
                        type="button"
                        disabled
                        className="w-24 rounded-md bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm"
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-24 rounded-md bg-indigo-600 px-3 py-2 text-sm font-normal text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Close
                      </button>
                    )}
                  </div>
                  <h3 className="text-base font-semibold leading-7 text-gray-900">
                    Event Detail
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                    You can change date and time here
                  </p>
                </div>
                <div className="border-t border-gray-100">
                  <dl className="divide-y divide-gray-100">
                    {displayHeaders.map((header, index) => {
                      const inputType =
                        header === "Date"
                          ? "date"
                          : header.includes("Start") || header.includes("End")
                          ? "datetime-local"
                          : "text";

                      let value = formData[header] || "";

                      if (header === "Date" && value) {
                        value = formatDateEdit(value);
                      } else if (
                        (header.includes("Start") || header.includes("End")) &&
                        value
                      ) {
                        value = formatDateTimeEdit(value);
                      }
                      return (
                        <div
                          key={index}
                          className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                        >
                          <dt className="text-sm font-medium text-gray-900">
                            {header}
                          </dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {editPlanStart ? (
                              <input
                                type={inputType}
                                value={value}
                                onChange={(e) =>
                                  handleInputChange(header, e.target.value)
                                }
                                className="border rounded p-2 w-full"
                              />
                            ) : (
                              formData[header]
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </>
            ) : (
              <div className="justify-center items-center py-12 px-12">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailView;
