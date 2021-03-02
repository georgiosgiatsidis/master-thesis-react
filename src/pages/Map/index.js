import React, { useEffect, useState } from "react";
import DatePicker from "../../components/DatePicker";
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

  useEffect(() => {
    let createdAt;

    if (dateRange.from && dateRange.to) {
      const from = dateRange.from.toISOString();
      const to = dateRange.to.endOf("day").toISOString();
      createdAt = `between:${from},${to}`;
    } else if (dateRange.from) {
      const from = dateRange.from.toISOString();
      createdAt = `gte:${from}`;
    } else if (dateRange.to) {
      const to = dateRange.to.endOf("day").toISOString();
      createdAt = `lte:${to}`;
    }

    setFilters((prevState) => ({
      ...prevState,
      createdAt,
    }));
  }, [dateRange]);

  const options = useTerms();

  return (
    <React.Fragment>
      <div className="flex m-4">
        <div>
          <span className="text-white">Term</span>
          <select
            className="w-full px-3 py-3 text-gray-700 rounded shadow outline-none"
            onChange={handleTermChange}
          >
            <option value="">All</option>
            {options.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-3">
          <span className="text-white">From</span>
          <DatePicker onChange={handleDateChange("from")} />
        </div>
        <div className="ml-3">
          <span className="text-white">To</span>
          <DatePicker onChange={handleDateChange("to")} />
        </div>
      </div>
      <div className="flex m-4">
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
