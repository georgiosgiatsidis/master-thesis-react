import React, { useState } from "react";
import moment from "moment";
import Datetime from "react-datetime";

const CustomInput = ({ date, onDateChange, ...rest }) => {
  return (
    <React.Fragment>
      <div className="relative flex flex-wrap items-stretch w-full">
        <input
          {...rest}
          readOnly
          placeholder="Select a date"
          className="relative w-full px-3 py-3 pr-10 text-sm text-gray-700 placeholder-gray-400 bg-white rounded shadow outline-none focus:outline-none"
        />
        <span
          onClick={() => onDateChange(null)}
          className="absolute right-0 z-10 items-center justify-center w-8 h-full py-3 pr-3 text-base font-normal leading-snug text-center text-gray-500 bg-transparent rounded cursor-pointer"
        >
          &times;
        </span>
      </div>
    </React.Fragment>
  );
};

const DatePicker = ({ onChange, selected, ...rest }) => {
  const [date, setDate] = useState(selected ? selected : null);

  const onDateChange = (date) => {
    if (moment(date).isValid()) {
      setDate(date);
      onChange && onChange(date.clone());
    } else {
      setDate(null);
      onChange && onChange(null);
    }
  };

  return (
    <Datetime
      dateFormat="DD/MM/YYYY"
      timeFormat={false}
      value={date}
      onChange={onDateChange}
      renderInput={(props) => (
        <CustomInput date={date} onDateChange={onDateChange} {...props} />
      )}
      {...rest}
    />
  );
};

export default DatePicker;
