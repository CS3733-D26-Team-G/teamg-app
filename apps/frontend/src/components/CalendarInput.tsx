import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";

interface CalendarInputProps {
  label: string;
  value: Date; // Accepts standard JS Date from your form state
  onChange: (date: Date) => void; // Sends back a standard JS Date
}

export default function CalendarInput({
  label,
  value,
  onChange,
}: CalendarInputProps) {
  // Convert the incoming Date to a Dayjs object for the MUI picker
  const dateValue = dayjs(value);

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      // Convert Dayjs back to standard JS Date before sending to parent
      onChange(newValue.toDate());
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", mb: 2 }}>
        <DesktopDatePicker
          label={label}
          value={dateValue}
          onChange={handleDateChange}
          sx={{ width: "100%" }}
          slotProps={{
            field: { clearable: true },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
