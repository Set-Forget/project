import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/slice";
import DetailView from "./DetailView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import AddEvent from "./AddEvent";
import MultiSelect from "./Multiselect";
// import classNames from "classnames";

function DraggableEvent({ event, ...props }) {
  const [, ref] = useDrag({
    type: "EVENT",
    item: { id: event.id },
  });

  return (
    <div ref={ref} {...props}>
      {props.children}
    </div>
  );
}

function DroppableDay({ day, onEventDrop, className, children, ...props }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "EVENT",
    drop: (item) => onEventDrop(day, item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`${className} ${isOver ? "border-2 border-indigo-200" : ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Calendar() {
  const { data } = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  const [selectedProductLine, setSelectedProductLine] = useState(["all"]);
  const [selectedCategory, setSelectedCategory] = useState(["all"]);
  // const [selectedProductLine, setSelectedProductLine] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [shouldUpdateData, setShouldUpdateData] = useState(false);
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);

  function handleMonthChange(e) {
    setSelectedMonth(Number(e.target.value));
  }

  function handleYearChange(e) {
    setSelectedYear(Number(e.target.value));
  }

  const openModalWithEvent = (eventId) => {
    setSelectedEvent(eventId);
    setIsModalVisible(true);
  };

  const rows = data.slice(1);
  const eventsMapping = {};

  rows.forEach((row) => {
    const date = new Date(row[3]);
    if (isNaN(date.getTime())) {
      return;
    }

    const eventDate = date.toISOString().slice(0, 10);

    if (!eventsMapping[eventDate]) {
      eventsMapping[eventDate] = [];
    }
    eventsMapping[eventDate].push({
      id: row[0],
      name: row[9],
      href: "#",
      datetime: row[3],
      time: `${new Date(row[5]).toLocaleTimeString()} - ${row[8]}`,
      productLine: row[2],
    });
  });

  Object.keys(eventsMapping).forEach((date) => {
    eventsMapping[date].sort((a, b) => {
      return (
        new Date(`1970-01-01 ${a.time.split(" - ")[0]}`) -
        new Date(`1970-01-01 ${b.time.split(" - ")[0]}`)
      );
    });
  });

  function generateDaysForMonth(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(
          i
        ).padStart(2, "0")}`,
        isCurrentMonth: true,
        events: [],
      });
    }

    // Adjust this to ensure calendar starts on Sunday
    while (firstDay.getDay() !== 0) {
      firstDay.setDate(firstDay.getDate() - 1);
      days.unshift({
        date: `${firstDay.getFullYear()}-${String(
          firstDay.getMonth() + 1
        ).padStart(2, "0")}-${String(firstDay.getDate()).padStart(2, "0")}`,
        isCurrentMonth: false,
        events: [],
      });
    }

    // This remains unchanged. It pads days until the end of the week (Saturday).
    while (days.length % 7 !== 0) {
      lastDay.setDate(lastDay.getDate() + 1);
      days.push({
        date: `${lastDay.getFullYear()}-${String(
          lastDay.getMonth() + 1
        ).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`,
        isCurrentMonth: false,
        events: [],
      });
    }

    return days;
  }

  useEffect(() => {
    let allCategories = data
      .map((el) => el[26])
      .filter(
        (value, index, array) => array.indexOf(value) === index && index != 0
      );
    if (categories.length >= 0) {
      allCategories.unshift("all");
      setCategories(allCategories);
    }

    const initialMonthDays = generateDaysForMonth(selectedYear, selectedMonth);

    const newMonthDays = [...initialMonthDays];

    newMonthDays.forEach((day) => {
      if (eventsMapping[day.date]) {
        day.events = day.events.concat(eventsMapping[day.date]);
      }
    });

    setCurrentMonthDays(newMonthDays);

    if (shouldUpdateData) {
      dispatch(fetchData());
    }
  }, [
    eventsMapping,
    selectedMonth,
    selectedYear,
    selectedProductLine,
    selectedCategory,
  ]);

  function getProductLineColor(productLine) {
    switch (productLine) {
      case 1:
        return "bg-[#93C4D1]";
      case 2:
        return "bg-[#D3C7E6]";
      case 3:
        return "bg-[#FED5CF]";
      default:
        return "bg-gray-200";
    }
  }

  // function classNames(...classes) {
  //   return classes.filter(Boolean).join(" ");
  // }

  const actualMonth = new Date(selectedYear, selectedMonth).toLocaleString(
    "en-US",
    { month: "long" }
  );

  const handleEventDrop = (targetDay, eventId) => {
    let movedEvent = null;

    // Immediately update the local state (UI)
    const updatedDays = currentMonthDays.map((day) => {
      const filteredEvents = day.events.filter((event) => {
        if (event.id === eventId) {
          movedEvent = event;
          return false;
        }
        return true;
      });
      return { ...day, events: filteredEvents };
    });

    const targetDayIndex = updatedDays.findIndex(
      (day) => day.date === targetDay.date
    );
    if (targetDayIndex !== -1 && movedEvent) {
      updatedDays[targetDayIndex].events.push(movedEvent);
    }

    setCurrentMonthDays(updatedDays); // This immediately updates the UI

    // Update the backend
    const updatedEventDate = targetDay.date;
    updateEventInBackend(eventId, updatedEventDate)
      .then(() => {
        // Handle success if necessary (e.g., show a success toast)
      })
      .catch((error) => {
        // Handle error (e.g., revert the change in the UI, show an error toast)
        console.error("Failed to update the backend", error);
        // Revert the UI change here if desired
      });
    setShouldUpdateData(true);
  };

  async function updateEventInBackend(eventId, updatedEventDate) {
    let url =
      "https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec?action=updateEventDate&eventId=" +
      eventId +
      "&date=" +
      updatedEventDate;
    const response = await fetch(url, { mode: "no-cors" });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    setShouldUpdateData(false);
  }

  // const handleEventDrop = (targetDay, eventId) => {
  //   let movedEvent = null;

  //   const updatedDays = currentMonthDays.map((day) => {
  //     const filteredEvents = day.events.filter((event) => {
  //       if (event.id === eventId) {
  //         movedEvent = event;
  //         return false;
  //       }
  //       return true;
  //     });
  //     return { ...day, events: filteredEvents };
  //   });

  //   const targetDayIndex = updatedDays.findIndex(
  //     (day) => day.date === targetDay.date
  //   );
  //   if (targetDayIndex !== -1 && movedEvent) {
  //     updatedDays[targetDayIndex].events.push(movedEvent);
  //   }

  //   setCurrentMonthDays(updatedDays);

  //   const updatedEventDate = targetDay.date;
  //   console.log("params: ", eventId, updatedEventDate);
  //   updateEventInBackend(eventId, updatedEventDate);
  //   setShouldUpdateData(true);
  // };

  // async function updateEventInBackend(eventId, updatedEventDate) {
  //   console.log();
  // let url =
  //   "https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec?action=updateEventDate&eventId=" +
  //   eventId +
  //   "&date=" +
  //   updatedEventDate;
  //   await fetch(url, {
  //     mode: "no-cors",
  //   });
  //   setShouldUpdateData(false);
  // }

  function openAddEventModal() {
    setOpenAddEvent(true);
  }

  return (
    <div className="p-8">
      {isModalVisible && (
        <DetailView
          event={selectedEvent}
          // setIsModalVisible={setIsModalVisible}
          onClose={() => setIsModalVisible(false)}
          setIsModalVisible={setIsModalVisible}
          data={data}
        />
      )}
      <div className="lg:flex mt-6 lg:h-full lg:flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
          <div className="flex items-center justify-center text-sm font-semibold text-gray-900 =mt-12 space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#93C4D1] rounded-md mr-2"></div>
              Product Line 1
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#D3C7E6] rounded-md mr-2"></div>
              Product Line 2
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#FED5CF] rounded-md mr-2"></div>
              Product Line 3
            </div>
          </div>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border-0 appearance-none focus:outline-none focus:border-none focus:ring-0"
            >
              <option value={0}>January</option>
              <option value={1}>February</option>
              <option value={2}>March</option>
              <option value={3}>April</option>
              <option value={4}>May</option>
              <option value={5}>June</option>
              <option value={6}>July</option>
              <option value={7}>August</option>
              <option value={8}>September</option>
              <option value={9}>October</option>
              <option value={10}>November</option>
              <option value={11}>December</option>
            </select>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border-0 appearance-none focus:outline-none focus:border-none focus:ring-0"
            >
              {Array.from(
                { length: new Date().getFullYear() - 1999 },
                (_, i) => 2000 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </h1>

          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex md:items-center">
              <MultiSelect
                label="Product Line"
                options={[
                  "all",
                  "Product Line 1",
                  "Product Line 2",
                  "Product Line 3",
                ]}
                selectedValues={selectedProductLine}
                onChange={setSelectedProductLine}
              />

              <MultiSelect
                label="Category"
                options={categories}
                selectedValues={selectedCategory}
                onChange={setSelectedCategory}
              />
              <div className="ml-6 h-6 w-px bg-gray-300" />
              <button
                onClick={openAddEventModal}
                type="button"
                className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add event
              </button>
            </div>
          </div>
        </header>
        {openAddEvent && <AddEvent setOpenAddEvent={setOpenAddEvent} />}
        <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
            <div className="bg-white py-2">
              S<span className="sr-only sm:not-sr-only">un</span>
            </div>
            <div className="bg-white py-2">
              M<span className="sr-only sm:not-sr-only">on</span>
            </div>
            <div className="bg-white py-2">
              T<span className="sr-only sm:not-sr-only">ue</span>
            </div>
            <div className="bg-white py-2">
              W<span className="sr-only sm:not-sr-only">ed</span>
            </div>
            <div className="bg-white py-2">
              T<span className="sr-only sm:not-sr-only">hu</span>
            </div>
            <div className="bg-white py-2">
              F<span className="sr-only sm:not-sr-only">ri</span>
            </div>
            <div className="bg-white py-2">
              S<span className="sr-only sm:not-sr-only">at</span>
            </div>
          </div>
          <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
              {currentMonthDays.map((day) => (
                <DroppableDay
                  key={day.date}
                  day={day}
                  onEventDrop={handleEventDrop}
                  className={classNames(
                    day.isCurrentMonth
                      ? "bg-white"
                      : "bg-gray-50 text-gray-500",
                    "relative px-3 py-4"
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={
                      day.isToday
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white border-2 border-indigo-600"
                        : undefined
                    }
                  >
                    {day.date.split("-").pop().replace(/^0/, "")}
                  </time>
                  {day.events.length > 0 && (
                    <ol className="mt-2">
                      {day.events
                        .filter((event) => {
                          const eventCategory = data.find(
                            (e) => e[0] === event.id
                          )[26];
                          const eventProductLineString = `Product Line ${event.productLine}`;
                          const matchesProductLine =
                            selectedProductLine.includes("all") ||
                            selectedProductLine.includes(
                              eventProductLineString
                            );
                          const matchesCategory =
                            selectedCategory.includes("all") ||
                            selectedCategory.includes(eventCategory);

                          return matchesProductLine && matchesCategory;
                        })
                        .map((event) => (
                          <DraggableEvent key={event.id} event={event}>
                            <div
                              className={classNames(
                                "relative px-2 mb-1 py-1 rounded-lg",
                                getProductLineColor(event.productLine)
                              )}
                            >
                              <li>
                                <a
                                  href={event.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openModalWithEvent(event.id);
                                  }}
                                  className="group flex flex-col"
                                >
                                  <p className="flex-auto truncate font-medium text-gray-900  mb-1 hover:whitespace-normal hover:overflow-visible">
                                    {event.name}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <time
                                      dateTime={event.datetime}
                                      className="-mt-2 text-xs text-gray-500 group-hover:text-indigo-600"
                                    >
                                      {event.time}
                                    </time>
                                  </div>
                                </a>
                              </li>
                            </div>
                          </DraggableEvent>
                        ))}
                    </ol>
                  )}
                </DroppableDay>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainView() {
  return (
    <DndProvider backend={HTML5Backend}>
      {/* Other components, including Calendar */}
      <Calendar />
    </DndProvider>
  );
}

export default MainView;
