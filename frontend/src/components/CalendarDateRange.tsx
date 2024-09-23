import { Calendar, DateObject } from "react-multi-date-picker";

function CalendarDateRange(props: { dateRange: Date[] }) {
  return (
    <Calendar
      disabled
      value={props.dateRange.map((date) => {
        return new DateObject(date);
      })}
    ></Calendar>
  );
}

export default CalendarDateRange;
