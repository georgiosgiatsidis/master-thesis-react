import { useEffect, useState } from "react";

const useTerms = () => {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/terms`)
      .then((response) => response.json())
      .then((result) => {
        setTerms(result);
      });
  }, []);

  return terms;
};

export default useTerms;
