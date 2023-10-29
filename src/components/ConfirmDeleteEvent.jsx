const ConfirmDeleteEvent = ({
  setIsLoadingDelete,
  setDeleteEventId,
  setConfirmModalVisible,
}) => {
  function handleConfirm() {
    setIsLoadingDelete(true);
    setDeleteEventId(true);
    setConfirmModalVisible(false);
  }

  function handleCancel() {
    setConfirmModalVisible(false);
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
        <div className="flex min-h-full items-end justify-center -mt-[600px] p-4 text-center sm:items-center sm:p-0">
          <div
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[400px] sm:my-8 sm:p-6"
            tabIndex="-1"
            autoFocus
          >
            <div className="mt-3 text-center sm:mt-5 text-sm montserrat">
              <h3
                className=" font-semibold text-sm leading-6 text-gray-900"
                id="modal-title"
              >
                This can't be undone.
              </h3>
              <p className="text-sm">
                Are you sure you want to delete this event?
              </p>
            </div>
            <div className="mt-5 flex justify-center">
              <button
                className="w-[120px] mr-2 rounded-lg bg-transparent px-3 py-2 border-2 border-indigo text-sm font-semibold text-indigo-600 shadow-sm hover:text-indigo-400"
                onClick={handleConfirm}
              >
                Delete
              </button>
              <button
                className="w-[120px] mr-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold lg:text-sm text-white shadow-sm hover:bg-indigo-400"
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

export default ConfirmDeleteEvent;
