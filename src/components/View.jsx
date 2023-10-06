import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/slice";
import DetailView from "./DetailView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";

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

function DroppableDay({ day, onEventDrop, ...props }) {
  const [{ isOver }, drop] = useDrop({
    accept: "EVENT",
    drop: (item) => onEventDrop(day, item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} {...props}>
      {props.children}
    </div>
  );
}

function Calendar() {
  const { data } = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  const [selectedProductLine, setSelectedProductLine] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [shouldUpdateData, setShouldUpdateData] = useState(false);

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

    while (firstDay.getDay() !== 1) {
      firstDay.setDate(firstDay.getDate() - 1);
      days.unshift({
        date: `${firstDay.getFullYear()}-${String(
          firstDay.getMonth() + 1
        ).padStart(2, "0")}-${String(firstDay.getDate()).padStart(2, "0")}`,
        isCurrentMonth: false,
        events: [],
      });
    }

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
    const initialMonthDays = generateDaysForMonth(
      new Date().getFullYear(),
      new Date().getMonth()
    );

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
  }, [eventsMapping]);

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

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const actualMonth = new Date().toLocaleString("en-US", { month: "long" });

  const handleEventDrop = (targetDay, eventId) => {
    let movedEvent = null;

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

    setCurrentMonthDays(updatedDays);

    const updatedEventDate = targetDay.date;
    console.log('params: ', eventId, updatedEventDate);
    updateEventInBackend(eventId, updatedEventDate);
    setShouldUpdateData(true);
  };

  async function updateEventInBackend(eventId, updatedEventDate) {
    console.log()
    let url =
      "https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec?action=updateEventDate&eventId=" +
      eventId +
      "&date=" +
      updatedEventDate;
    await fetch(url, {
      mode: "no-cors",
    });
    setShouldUpdateData(false);
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
            <time dateTime="2022-01">
              {actualMonth} {new Date().getFullYear()}
            </time>
          </h1>

          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex md:items-center">
              <select
                className="rounded-lg text-sm font-normal focus:outline-none focus:ring focus:ring-indigo-300"
                value={selectedProductLine}
                onChange={(e) => setSelectedProductLine(e.target.value)}
              >
                <option selected disabled>
                  Filter by Product Line
                </option>
                <option value="all">All</option>
                <option value="1">Product Line 1</option>
                <option value="2">Product Line 2</option>
                <option value="3">Product Line 3</option>
              </select>
              <div className="ml-6 h-6 w-px bg-gray-300" />
              <button
                type="button"
                className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add event
              </button>
            </div>
          </div>
        </header>
        <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
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
            <div className="bg-white py-2">
              S<span className="sr-only sm:not-sr-only">un</span>
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
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                        : undefined
                    }
                  >
                    {day.date.split("-").pop().replace(/^0/, "")}
                  </time>
                  {day.events.length > 0 && (
                    <ol className="mt-2">
                      {day.events
                        .filter(
                          (event) =>
                            selectedProductLine === "all" ||
                            event.productLine === Number(selectedProductLine)
                        )
                        .map((event) => (
                          <DraggableEvent key={event.id} event={event}>
                            <div
                              className={classNames(
                                "relative px-2 rounded-lg",
                                getProductLineColor(event.productLine)
                              )}
                              // onMouseEnter={() => openModalWithEvent(event.id)}
                            >
                              <li>
                                <a
                                  href={event.href}
                                  onClick={(e) => {
                                    e.preventDefault(); 
                                    openModalWithEvent(event.id);
                                  }}
                                  className="group flex"
                                >
                                  <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                                    {event.name}
                                  </p>
                                  <time
                                    dateTime={event.datetime}
                                    className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                                  >
                                    {event.time}
                                  </time>
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