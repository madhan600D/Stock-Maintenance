import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import Styles from './LineGraph.module.css'

function LineGraph({ChartName = 'DataChart'  , Data, Height = 300, Width = 600  , XLabel = 'XAxis' , YLabel = 'YAxis' , Smooth = d3.curveLinear , LegendArray = []}) {
  const SVGRef = useRef();

  useEffect(() => {
    if (!Data?.length) return;

    const Margin = { Top: 30, Right: 30, Bottom: 70, Left: 60 };

    const YScaleMax = GetMaxOfYScale(Data);
    const DataSeries = GraphSeriesGenerator(Data);

    console.log("Line Graph:" , Data)

    console.log("Line Graph Dataseries:" , LegendArray)
    // Clear previous render
    d3.select(SVGRef.current).selectAll("*").remove();
    

    // Setup SVG group
    const SVG = d3
      .select(SVGRef.current)
      .attr("width", Width + Margin.Left + Margin.Right)
      .attr("height", Height + Margin.Top + Margin.Bottom)
      .append("g")
      .attr("transform", `translate(${Margin.Left}, ${Margin.Top})`);

    // X scale (categorical)
    const XScale = d3
      .scalePoint()
      .domain(Data.map((d) => d.XVal))
      .range([0, Width])
      .padding(0.3);

    // Y scale
    const YScale = d3
      .scaleLinear()
      .domain([0, YScaleMax])
      .range([Height, 0])
      .nice();

    // X-axis
    const XAxis = SVG.append("g")
      .attr("transform", `translate(0, ${Height})`)
      .style('font-size' , '10px')
      .style('font-family' , 'poppins')
      .style('font-weight' , 'bold')
      .style('stroke-opacity' , 0)
      .call(d3.axisBottom(XScale)
        .tickSize(0)
        .tickPadding(10)
      )
      .selectAll("text")
      
      .attr("transform", "translate(-10,0) rotate(-45)")
      .style("text-anchor", "end");

    // Y-axis
    const YAxis = SVG.append("g")
      .call(d3.axisLeft(YScale)
          .tickSize(0)
          .tickPadding(10))
      .style('font-size' , '10px')
      .style('font-family' , 'poppins')
      .style('font-weight' , 'bold')
      .style('stroke-opacity' , 0)
      .style('fill' , '#777')


    // Line generator
    const Line = d3
      .line()
      .x((d) => XScale(d.X))
      .y((d) => YScale(d.Y))
      .curve(Smooth)
    
      //Add Grid Lines
      //XGrid ->
      SVG.selectAll(".XGrid")
        .data(XScale.domain().slice(1))
        .join("line")
        .attr("x1", d => XScale(d))
        .attr("x2", d => XScale(d))
        .attr("y1", 0)
        .attr("y2", Height)
        .attr("stroke", "#9a9a9a8c")
        .attr("stroke-width", .5);

      //YGrid ->
      SVG.selectAll("yGrid")
        .data(YScale.ticks().slice(1 , -1))
        .join("line")
        .attr("x1", 0)
        .attr("x2", Width)
        .attr("y1", d => YScale(d))
        .attr("y2", d => YScale(d))
        .attr("stroke", "#9a9a9a8c")
        .attr("stroke-width", .5)

        //Y-Axis Label
        SVG.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - Margin.Left - 2.5)
          .attr("x", 0 - (Height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .style("fill", "#777")
          .style("font-family", "sans-serif")
          .text(YLabel);

          //Y-Axis Label
          SVG.append("text")
            .attr("y", 0 - Margin.Top)
            .attr("x", (Width / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "#777")
            .style("font-family", "sans-serif")
            .text(XLabel);

          //Chart Name
          SVG.append("text")
            .attr("class", "chart-title")
            .attr("x", Width - (Margin.Left + Margin.Right) - (ChartName.length * 3))
            .attr("y", 0 - 10)
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("font-family", "poppins")
            .style("fill", "rgba(0, 231, 235, 0.46)")
            .text(ChartName);

            //Legends
            

    // Color scale
    const Color = d3.scaleOrdinal(d3.schemeTableau10);

    // Legend setup
    const LegendGroup = SVG.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${Width + 30}, 20)`); 

    // Legend entries
    const legendItems = LegendGroup.selectAll(".legend-item")
      .data(LegendArray)
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`); // space between items

    // Colored line box (or circle)
    legendItems.append("rect")
      .attr("x", 0)
      .attr("y", -10)
      .attr("width", 18)
      .attr("height", 3)
      .attr("fill", d => Color([d.Values]))
      .attr("rx", 1.5);

    // Label text
    legendItems.append("text")
      .attr("x", 25)
      .attr("y", 0)
      .attr("font-size", "13px")
      .attr("font-family", "Poppins, sans-serif")
      .attr("fill", "#666")
      .text(d => LegendArray[d.Values]);

    // Draw lines
    SVG.selectAll(".line")
      .data(DataSeries)
      .join("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", d => Color(d.Name))
      .attr("stroke-width", 2)
      .attr("d", d => Line(d.Values))
      .each(function() {
        const totalLength = this.getTotalLength();

        d3.select(this)
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(700)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      });
  }, [Data, Height, Width]);

  // Helpers
  function GetMaxOfYScale(Data) {
    let YMaxScale = 0;
    for (let Obj of Data) {
      YMaxScale = Math.max(...Obj.YVal, YMaxScale);
    }
    return YMaxScale;
  }

  function GraphSeriesGenerator(Data) {
    const SeriesOfData = [];
    const numberOfLines = Data[0].YVal.length;
    
    for (let lineIndex = 0; lineIndex < numberOfLines; lineIndex++) {
      const SingleSeries = {
        Name: `Line${lineIndex}`,
        Values: Data.map((d , i) => ({
          Index:i,
          X: d.XVal,
          Y: d.YVal[lineIndex],
        })),
      };
      SeriesOfData.push(SingleSeries);
    }
    console.log("Fun" , SeriesOfData)

    return SeriesOfData;
  }

  return (
    <div className = {Styles['Main-Div']}>
        <div className = {Styles['Top-Div']}>
        </div>
      <svg ref={SVGRef}></svg>
    </div>
  );
}

export default LineGraph;
