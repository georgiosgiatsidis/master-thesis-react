import React, { useEffect, useCallback, useState, useRef } from "react";
import { Pie } from "@nivo/pie";
import queryString from "query-string";
import useInterval from "../../hooks/useInterval";
import { sentiments } from "../../helpers/utils";

const buildMap = () => {
  return new window.google.maps.Map(document.getElementById("map-container"), {
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
};

let map;

const GoogleMaps = ({ filters }) => {
  const labelRef = useRef();
  const [active, setActive] = useState(null);
  const [cachedData, setCachedData] = useState([]);

  const loadSentimentData = useCallback(() => {
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
          setCachedData(data);
          data.forEach((row) => {
            const feature = map.data.getFeatureById(row.countryCode);
            if (feature) {
              feature.setProperty("sentiment", row.mainSentiment);
            }
          });
        });
    }
  }, [filters]);

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
  }, [filters, loadSentimentData]);

  useInterval(() => {
    loadSentimentData();
  }, 60 * 1000);

  const onLoad = () => {
    map = buildMap();

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

    let infoWindow = new window.google.maps.InfoWindow();

    map.data.addListener("mouseover", (e) => {
      if (
        e.feature.getProperty("sentiment") &&
        e.feature.getProperty("state") !== "hover"
      ) {
        setActive(e.feature.getId());
        const pos = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };

        const contentString = `<div>
        <div>
            Country: ${e.feature.getId()}
        </div>
        <div>
            Main Sentiment: ${e.feature.getProperty("sentiment")}
        </div>
        </div>
        `;
        infoWindow.setPosition(pos);
        infoWindow.setContent(contentString);
        infoWindow.open(map);
      }

      e.feature.setProperty("state", "hover");
    });

    map.data.addListener("mouseout", (e) => {
      e.feature.setProperty("state", "normal");
      infoWindow.close();
      setActive(null);
    });

    map.data.loadGeoJson(
      "/countries.geo.json"
      // {
      // idPropertyName: "ISO_A3",
      //}
    );

    window.google.maps.event.addListenerOnce(map.data, "addfeature", () => {
      loadSentimentData();
    });
  };

  const clearSentimentData = () => {
    if (map) {
      map.data.forEach((row) => {
        row.setProperty("sentiment", undefined);
      });
    }
    setActive(null);
  };

  const activeData = cachedData.find((x) => x.countryCode === active);
  return (
    <React.Fragment>
      <div
        style={{
          position: "absolute",
          left: "0",
          zIndex: 100,
          background: "#fff",
        }}
        ref={labelRef}
      >
        {active && (
          <Pie
            width={400}
            height={400}
            colors={(d) => {
              return d.data.color;
            }}
            data={
              activeData && activeData.tweets
                ? activeData.tweets.reduce(
                    (acc, next) => {
                      const found = acc.find(
                        (item) => item.id === next.sentiment
                      );
                      found.value += 1;
                      return acc;
                    },
                    Object.keys(sentiments).map((key) => {
                      return {
                        id: key,
                        label: key,
                        value: 0,
                        color: sentiments[key].background,
                      };
                    })
                  )
                : []
            }
            margin={{
              top: 80,
              right: 120,
              bottom: 80,
              left: 120,
            }}
            innerRadius={0.5}
            padAngle={0.7}
          />
        )}
      </div>
      <div style={{ height: "90vh" }} id="map-container"></div>
    </React.Fragment>
  );
};

export default GoogleMaps;
