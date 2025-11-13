import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import Styles from "./BarChart.module.css";

function BarChart({ Data, Height, Width }) {
  const SVGRef = useRef();

  useEffect(() => {
    if (!Data?.length) return;

    const Margin = { Top: 30, Right: 30, Bottom: 70, Left: 60 };

    // Clear previous render
    d3.select(SVGRef.current).selectAll("*").remove();

    // Setup SVG group
    const SVG = d3
      .select(SVGRef.current)
      .attr("width", Width + Margin.Left + Margin.Right)
      .attr("height", Height + Margin.Top + Margin.Bottom)
      .append("g")
      .attr("transform", `translate(${Margin.Left}, ${Margin.Top})`);
      

    // X scale
    const XScale = d3
      .scaleBand()
      .domain(Data.map(d => d.ValX))
      .range([0, Width])
      .padding(0.2);

    // Y scale
    const YScale = d3
      .scaleLinear()
      .domain([0, d3.max(Data, d => d.ValY)])
      .range([Height, 0]);

    // X Axis
    SVG.append("g")
      .attr("transform", `translate(0, ${Height})`)
      .call(d3.axisBottom(XScale))
      .selectAll("text")
      .attr("transform", "translate(-10,0) rotate(-45)")
      .style("text-anchor", "end");

    // Y Axis
    SVG.append("g").call(d3.axisLeft(YScale));

    //Bar Colors
    const ColorScale = d3.scaleOrdinal(d3.schemeOranges)
    //Bars setup 
    const Bar = SVG .selectAll("rect") .data(Data) 

    
    Bar.enter().append("rect") 
        .attr('x' , (D) => XScale(D.ValX)) 
        .attr('width' , XScale.bandwidth()) 
        .attr('height' , (D) => Height - YScale(D.ValY)) 
        .attr('fill' , 'steelblue')
        .attr("y", Height)                // Start from bottom (invisible)
        .attr("height", 0)                // Start with zero height
        .attr("fill", 'orange')
        .transition()                     // Animate to final position
        .duration(500)                   // 1 second animation
        .ease(d3.easeLinear)           // Smooth easing
        .attr("y", d => YScale(d.ValY))   // Final y position
        .attr("height", d => Height - YScale(d.ValY)); // Final height

  }, [Data, Height, Width]);

  return (
    <div className = {Styles['Main-Div']}>
      <svg ref={SVGRef} className={Styles["Main-SVG"]} />
    </div>
    
);
}

export default BarChart;
