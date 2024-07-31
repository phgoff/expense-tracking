import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

export const formatDate = (
  date: Date | string | null,
  format = "DD/MM/YYYY",
) => {
  const d = !date ? dayjs() : dayjs(date);
  return dayjs(d).format(format);
};

export default dayjs;
