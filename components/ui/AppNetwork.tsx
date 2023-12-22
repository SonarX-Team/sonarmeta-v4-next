"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

import graph from "@/constants/graph.json";

interface GraphNode {
  symbolSize: number;
  label?: {
    show?: boolean;
  };
}
type EChartsOption = echarts.EChartsOption;

export default function AppNetwork() {
  const chartDom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // myChart.showLoading(); fetch之前

    let myChart = echarts.init(chartDom.current);
    let option: EChartsOption;

    myChart.hideLoading();

    graph.nodes.forEach(function (node: GraphNode) {
      node.label = {
        show: node.symbolSize > 30,
      };
    });

    option = {
      title: {
        text: "IP Network",
        top: "bottom",
        left: "right",
      },
      legend: [
        {
          data: graph.categories.map(function (a: { name: string }) {
            return a.name;
          }),
        },
      ],
      animationDuration: 1500,
      animationEasingUpdate: "quinticInOut",
      series: [
        {
          name: "IP Network",
          type: "graph",
          layout: "none",
          data: graph.nodes,
          links: graph.links,
          categories: graph.categories,
          zoom: 1.5,
          roam: true,
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
          lineStyle: {
            color: "source",
            width: 1.5,
            curveness: 0.1,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 8,
            },
          },
        },
      ],
    };

    myChart.setOption(option);
  }, []);

  return <div ref={chartDom} className="bg-light-1 shadow-lg rounded-xl h-[666px]" />;
}
