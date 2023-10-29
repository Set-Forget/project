import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useDispatch } from "react-redux";
import { fetchData } from "../../redux/slice";
import ConfirmDeleteEvent from "./ConfirmDeleteEvent";

function DetailView({
  event,
  setIsModalVisible,
  onClose,
  data,
  setShouldUpdateData,
}) {
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
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${hours}:${minutes}:00`;
  }

  let formattedEventData = [...filteredEventData];
  formattedEventData[3] = formatDate(formattedEventData[3]);
  formattedEventData[5] = formatTime(formattedEventData[5]);
  formattedEventData[6] = formatTime(formattedEventData[6]);

  const [editPlanStart, setEditPlanStart] = useState(false);
  const [editedPlanStart, setEditedPlanStart] = useState("");
  const [eventId, setEventId] = useState("");
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [putTime, setPutTime] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setEditedPlanStart(formattedEventData[5]);
    setEventId(formattedEventData[0]);
    // if (putTime) {
    //   dispatch(fetchData());
    // }
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
  }, [deleteEventId, isLoadingDelete, dispatch, editPlanStart]);

  const handleDeleteEvent = () => {
    setConfirmModalVisible(true);
    // setIsLoadingDelete(true);
    // setDeleteEventId(true);
  };

  const handleSave = () => {
    setIsLoadingPost(true);
    // setPutTime(true);
    putPlanTime(eventId, editedPlanStart);
    setPutTime(false);
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

  async function putPlanTime(eventId, updatedPlanTime) {
    try {
      let url = `https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec?action=updatePlanTime&eventId=${eventId}&time=${updatedPlanTime}`;

      await fetch(url, {
        mode: "no-cors",
      });

      // Assuming fetchData() returns a promise (like another fetch call)
      await dispatch(fetchData());

      setPutTime(true);
      setIsLoadingPost(false);
      setEditPlanStart(false);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating plan time:", error);
      // Handle the error appropriately
    }
  }

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
                    {headers.map((el, e) => {
                      return (
                        <div
                          key={e}
                          className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                        >
                          <dt className="text-sm font-medium text-gray-900">
                            {el}
                          </dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {e === 5 && editPlanStart ? (
                              <input
                                type="time"
                                value={editedPlanStart}
                                onChange={(e) =>
                                  setEditedPlanStart(e.target.value)
                                }
                                className="border rounded p-2 w-full"
                                step="1"
                              />
                            ) : (
                              formattedEventData[e]
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
