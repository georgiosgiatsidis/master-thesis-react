import React, { useEffect } from "react";
import moment from "moment";
import { sentiments } from "../../helpers/utils";
import useInterval from "../../hooks/useInterval";
import useTerms from "../../hooks/useTerms";

let map;

const Map = () => {
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement(`script`);
      script.type = `text/javascript`;
      script.src =
        `https://maps.google.com/maps/api/js?key=` +
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const headScript = document.getElementsByTagName(`script`)[0];
      headScript.parentNode.insertBefore(script, headScript);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  });

  const onLoad = () => {
    map = new window.google.maps.Map(document.getElementById("map-container"), {
      zoom: 3,
      center: { lat: 30, lng: 31 },
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
      streetViewControl: false,
      mapTypeControl: false,
      styles: [
        {
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#242f3e" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#17263c" }],
        },
      ],
    });

    map.data.setStyle((feature) => {
      const sentiment = feature.getProperty("sentiment");

      let outlineWeight = 0.5;

      if (feature.getProperty("state") === "hover") {
        outlineWeight = 2;
      }

      return {
        fillColor: sentiment ? sentiments[sentiment].background : "#fff",
        fillOpacity: sentiment ? "1" : "0",
        strokeColor: "#fff",
        strokeWeight: outlineWeight,
      };
    });

    map.data.addListener("mouseover", (e) => {
      e.feature.setProperty("state", "hover");
    });

    map.data.addListener("mouseout", (e) => {
      e.feature.setProperty("state", "normal");
    });

    map.data.loadGeoJson("/countries_detailed.geo.json", {
      idPropertyName: "ISO_A3",
    });

    window.google.maps.event.addListenerOnce(map.data, "addfeature", () => {
      loadSentimentData();
    });
  };

  const loadSentimentData = (option) => {
    fetch(`${process.env.REACT_APP_API_URL}/countries/tweets`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((row) => {
          const feature = map.data.getFeatureById(row.countryCode);
          if (feature) {
            feature.setProperty("sentiment", row.mainSentiment);
          }
        });
      });
  };

  function clearSentimentData() {
    map.data.forEach((row) => {
      row.setProperty("sentiment", undefined);
    });
  }

  const handleChange = (e) => {
    clearSentimentData();
    loadSentimentData(e.target.value);
  };

  useInterval(() => {
    loadSentimentData();
  }, 60 * 1000);

  const options = useTerms();

  return (
    <React.Fragment>
      <div>
        <select onChange={handleChange}>
          <option value="">All</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          onChange={() => {}}
          value={moment().format("YYYY-MM-DD")}
        />
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
      <div style={{ height: "90vh" }} id="map-container"></div>
    </React.Fragment>
  );
};

export default Map;
