import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import GoogleMaps from "../../components/GoogleMaps";
import useTerms from "../../hooks/useTerms";
import { sentiments } from "../../helpers/utils";

const Map = () => {
  const [filters, setFilters] = useState({});
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleTermChange = (e) => {
    setFilters((prevState) => ({ ...prevState, term: e.target.value }));
  };

  const handleDateChange = (key) => (date) => {
    setDateRange((prevState) => ({ ...prevState, [key]: date }));
  };

  console.log(dateRange);

  useEffect(() => {
    let createdAt;

    if (dateRange.from && dateRange.to) {
      const from = dateRange.from.toISOString();
      const to = dateRange.to.toISOString();
      createdAt = `between:${from},${to}`;
    }

    setFilters((prevState) => ({
      ...prevState,
      createdAt,
    }));
  }, [dateRange]);

  const options = useTerms();

  return (
    <React.Fragment>
      <div>
        <select onChange={handleTermChange}>
          <option value="">All</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Datetime onChange={handleDateChange("from")} timeFormat={false} />
        <Datetime onChange={handleDateChange("to")} timeFormat={false} />
      </div>
      <div className="flex">
        {Object.keys(sentiments).map((key) => (
          <div
            key={key}
            className="p-1 my-1 mr-2 text-xs text-white"
            style={{ background: sentiments[key].background }}
          >
            {sentiments[key].label}
          </div>
        ))}
      </div>
      <GoogleMaps filters={filters} />
    </React.Fragment>
  );
};

export default Map;
