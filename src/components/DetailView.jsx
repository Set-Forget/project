import { PaperClipIcon } from "@heroicons/react/20/solid";

function DetailView({ event, onClose, data }) {
  let headers = data[0];
  let filteredEventData = data.filter((el) => el[0] == event)[0];
  console.log("filtered", filteredEventData);
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
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[600px] sm:my-8 sm:p-6">
            <div className="px-4 py-6 sm:px-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Event Detail
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                You can change date and time here
              </p>
            </div>
            <div className="border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    {headers[0]}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {filteredEventData[0]}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    {headers[1]}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {filteredEventData[1]}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    {headers[2]}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {filteredEventData[2]}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    {headers[3]}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {filteredEventData[3]}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    {headers[4]}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {filteredEventData[4]}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    {headers[5]}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {filteredEventData[5]}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    {headers[6]}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {filteredEventData[6]}
                  </dd>
                </div> */}
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
                        {filteredEventData[e]}
                      </dd>
                    </div>
                  );
                })}
                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="m-auto w-24 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Close
                  </button>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailView;
