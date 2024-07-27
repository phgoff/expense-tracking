import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatLocal = (
  date: Date | string | null,
  format = "DD/MM/YYYY"
) => {
  const d = !date ? dayjs() : dayjs(date);
  return dayjs(d).tz("Asia/Bangkok").format(format);
};

export default dayjs;
