import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type BarChartProps = {
  title: string;
  categories: string[];
  data: number[];
};

export default function BarChart({ title, categories, data }: BarChartProps) {
  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: title,
    },
    xAxis: {
      categories: categories,
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Values",
        align: "high",
      },
    },
    tooltip: {
      valueSuffix: "",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        type: "column",
        name: "Data",
        data: data,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
