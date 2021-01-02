import React, { useEffect } from "react";
import queryString from "query-string";
import useInterval from "../../hooks/useInterval";
import { sentiments } from "../../helpers/utils";

let map;

const GoogleMaps = ({ filters }) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    clearSentimentData();
    loadSentimentData();
  }, [filters]);

  useInterval(() => {
    loadSentimentData();
  }, 60 * 1000);

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

  const loadSentimentData = () => {
    if (map) {
      let stringifiedFilters = queryString.stringify(filters);

      if (stringifiedFilters) {
        stringifiedFilters = `?${stringifiedFilters}`;
      }

      fetch(
        `${process.env.REACT_APP_API_URL}/countries/tweets${stringifiedFilters}`
      )
        .then((res) => res.json())
        .then((data) => {
          data.forEach((row) => {
            const feature = map.data.getFeatureById(row.countryCode);
            if (feature) {
              feature.setProperty("sentiment", row.mainSentiment);
            }
          });
        });
    }
  };

  const clearSentimentData = () => {
    if (map) {
      map.data.forEach((row) => {
        row.setProperty("sentiment", undefined);
      });
    }
  };

  return (
    <React.Fragment>
      <div style={{ height: "90vh" }} id="map-container"></div>
    </React.Fragment>
  );
};

export default GoogleMaps;
