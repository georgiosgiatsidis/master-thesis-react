import { Bar } from "@nivo/bar";
// import { useEffect, useState } from "react";
import BarComponent from "./BarComponent";

const RaceChart = ({ data }) => {
  const barData = data
    .map((x) => {
      return { value: x._1, id: x._2 };
    })
    .sort((a, b) => a.value - b.value);

  return (
    <>
      <h2 className="ml-12 text-white">
        Top hashtags during last{" "}
        <strong className="text-white">60 seconds</strong>
      </h2>
      <Bar
        width={800}
        height={500}
        layout="horizontal"
        margin={{ top: 26, right: 120, bottom: 26, left: 60 }}
        data={barData}
        indexBy="id"
        keys={["value"]}
        colors={{ scheme: "spectral" }}
        colorBy="indexValue"
        borderColor={{ from: "color", modifiers: [["darker", 2.6]] }}
        enableGridX
        enableGridY={false}
        axisTop={{
          format: "~s",
        }}
        axisBottom={{
          format: "~s",
        }}
        axisLeft={null}
        padding={0.3}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
        isInteractive={false}
        barComponent={BarComponent}
        motionStiffness={170}
        motionDamping={26}
      />
    </>
  );
};

export default RaceChart;
