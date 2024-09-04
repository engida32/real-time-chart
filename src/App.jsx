import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "./App.css";

function generateInitialData() {
  const initialData = [];
  let baseValue = 6600;
  for (let i = 0; i < 20; i++) {
    baseValue += Math.random() * 10 - 10;
    initialData.push(generateRandomCandlestick(baseValue));
  }
  return initialData;
}

// Generate random candlestick data
function generateRandomCandlestick(baseValue, isTapped) {
  const open = baseValue + Math.random() * 5 - 2.5;
  const close = isTapped ? open + Math.random() * 10 : open - Math.random() * 5;
  const high = Math.max(open, close) + Math.random() * 5;
  const low = Math.min(open, close) - Math.random() * 5;
  const timestamp = new Date().getTime();

  return {
    x: new Date(timestamp),
    y: [open, high, low, close],
  };
}

const App = () => {
  const [candlestickData, setCandlestickData] = useState(generateInitialData());
  const [isTapped, setIsTapped] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const chartOptions = {
    chart: {
      type: "candlestick",
      redrawOnWindowResize: true,
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: "#90CAF9",
            opacity: 0.4,
          },
          stroke: {
            color: "#0D47A1",
            opacity: 0.4,
            width: 1,
          },
        },
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        },
        autoSelected: "zoom",
      },
      animations: {
        enabled: true,
        easing: "linear",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      events: {
        click: function () {
          setIsTapped(true);
          console.log("isTapped", isTapped);
        },
      },
    },
    xaxis: {
      type: "datetime",

      labels: {
        datetimeUTC: false,
        style: {
          colors: "#B99470",
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },

      show: screenWidth > 768,
      labels: {
        show: screenWidth > 768,
        formatter: function (value) {
          return value.toFixed(2);
        },
        style: {
          colors: "#B99470",
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#00FF00",
          downward: "#FF0000",
        },

        wick: {
          useFillColor: true,
        },
      },
    },

    // theme: {
    //   mode: "light",
    //   palette: "palette1",
    //   monochrome: {
    //     enabled: true,
    //     color: "#255aee",
    //     shadeTo: "light",
    //     shadeIntensity: 0.65,
    //   },
    // },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCandlestickData((prevData) => {
        const lastPrice = prevData[prevData.length - 1].y[3];
        const newCandlestick = generateRandomCandlestick(lastPrice, isTapped);
        const updatedData = [...prevData.slice(1), newCandlestick];
        return updatedData;
      });

      setIsTapped(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [isTapped]);

  return (
    <div>
      <h3>Candlestick Chart</h3>
      <ReactApexChart
        options={chartOptions}
        series={[{ data: candlestickData }]}
        type="candlestick"
        height={550}
      />
      <p style={{ color: "#FCF8F3" }}>
        Click on the chart to simulate a bullish candlestick
      </p>
    </div>
  );
};

export default App;
