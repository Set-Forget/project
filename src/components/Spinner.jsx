export default function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6">
        <div className="relative">
          <div className="w-6 h-6 rounded-full absolute border-4 border-solid border-gray-200"></div>
          <div className="w-6 h-6 rounded-full animate-spin absolute border-2 border-solid border-indigo-500 border-t-transparent shadow-md"></div>
        </div>
      </div>
    </div>
  );
}
