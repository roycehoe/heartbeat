// The app's day boundary is Singapore midnight, matching the backend's nightly
// reset. Comparing against the browser's local day instead would put a
// check-in in the wrong column for any caregiver whose device is not on SGT.
const APP_TIME_ZONE = "Asia/Singapore";

const APP_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The calendar date `date` falls on in the app's timezone, as `YYYY-MM-DD`. */
export const getAppDate = (date: Date) => APP_DATE_FORMATTER.format(date);

export const isAppToday = (date: Date) =>
  getAppDate(date) === getAppDate(new Date());

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getAppDateParts = (date: Date) => {
  const [year, month, day] = getAppDate(date).split("-").map(Number);
  return { year, month, day };
};

export const getDayAbbreviation = (date: Date) => {
  const { year, month, day } = getAppDateParts(date);
  return DAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
};

export const getMonthDayAbbreviation = (date: Date) => {
  const { month, day } = getAppDateParts(date);
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]}`;
};
