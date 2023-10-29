export default function LoadingSpinner() {
    return (
      <div className="flex justify-end items-center">
        <div className="w-6 right-1 -mt-[50px]">
          <div className="left">
            <div className="w-4 h-4 rounded-full absolute"></div>
            <div className="w-4 h-4 rounded-full animate-spin absolute border-2 border-solid border-indigo-500 border-t-transparent shadow-md"></div>
          </div>
        </div>
      </div>
    );
  }
  