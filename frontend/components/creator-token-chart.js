import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

export default function CreatorTokenChart() {
  var circulatingTokens = [];
  var dataPoints = [];

  for (var i = 0; i < 201; i += 1) {
    if (i === 0) {
      circulatingTokens.push(0.01);
    } else {
      circulatingTokens.push(i * 50);
    }
  }

  circulatingTokens.forEach(function (item) {
    var num = 0.3 * (item / 666) ** 3;
    dataPoints.push(num.toFixed(2));
  });

  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Creator Token Price',
        data: dataPoints,
      },
    ],
    options: {
      chart: {
        type: 'area',
        height: 350,
        zoom: {
          enabled: false,
        },
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 2,
          opacity: 0.5,
          color: '#3f3fc2',
        },
      },
      colors: ['#4c4edc'],
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: false,
      },
      fill: {
        colors: ['#4c4edc', '#4c4edc', '#4c4edc'],
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: 'Price Demand Curve',
        align: 'left',
        style: {
          color: '#FFFFFF',
        },
      },
      subtitle: {
        text: 'Circulating Tokens x Price',
        align: 'left',
        style: {
          color: '#FFFFFF',
        },
      },
      labels: circulatingTokens,
      xaxis: {
        type: 'number',
        tickAmount: 25,
        labels: {
          formatter: function (value) {
            return value;
          },
          style: { colors: '#FFF' },
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: false,
          dropShadow: {
            enabled: false,
            top: 0,
            left: 0,
            blur: 1,
            opacity: 0.4,
          },
        },
      },
      yaxis: {
        opposite: true,
        labels: {
          formatter: function (value) {
            return '$' + value;
          },
          style: { colors: '#FFF' },
        },
      },
      legend: {
        horizontalAlign: 'left',
      },
    },
  });

  return (
    <div id='chart'>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type='area'
        height={350}
      />
    </div>
  );
}
