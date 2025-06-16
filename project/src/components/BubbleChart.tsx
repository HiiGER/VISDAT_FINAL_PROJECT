import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Zap } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';

interface BubbleChartProps {
  tracks: SpotifyTrack[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ tracks }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || tracks.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data
    const data = tracks
      .filter(t => t.energy_percent > 0 && t.danceability_percent > 0 && t.valence_percent > 0)
      .slice(0, 50) // Limit for performance
      .map(track => ({
        x: track.energy_percent,
        y: track.danceability_percent,
        z: track.valence_percent,
        streams: track.streams,
        name: track.track_name,
        artist: track.artist_name
      }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y) as [number, number])
      .range([height, 0]);

    const sizeScale = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.streams) as [number, number])
      .range([3, 25]);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(data, d => d.z) as [number, number]);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "#6b7280")
      .style("text-anchor", "middle")
      .text("Energy %");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("fill", "#6b7280")
      .style("text-anchor", "middle")
      .text("Danceability %");

    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(255, 255, 255, 0.95)")
      .style("padding", "12px")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.15)")
      .style("font-size", "12px")
      .style("max-width", "250px")
      .style("z-index", "1000");

    // Add bubbles
    g.selectAll(".bubble")
      .data(data)
      .enter().append("circle")
      .attr("class", "bubble")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 0)
      .style("fill", d => colorScale(d.z))
      .style("opacity", 0.7)
      .style("stroke", "#fff")
      .style("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .attr("r", sizeScale(d.streams) * 1.2);
        
        tooltip
          .html(`
            <strong>${d.name}</strong><br/>
            by ${d.artist}<br/>
            Energy: ${d.x}%<br/>
            Danceability: ${d.y}%<br/>
            Valence: ${d.z}%<br/>
            Streams: ${d.streams.toLocaleString()}
          `)
          .style("visibility", "visible");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 0.7)
          .attr("r", sizeScale(d.streams));
        
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 20)
      .attr("r", d => sizeScale(d.streams));

    // Cleanup tooltip on component unmount
    return () => {
      d3.select("body").selectAll("div").filter(function() {
        return d3.select(this).style("position") === "absolute" && 
               d3.select(this).style("visibility") === "hidden";
      }).remove();
    };
  }, [tracks]);

  return (
    <div className="bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-lg border border-yellow-200/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-yellow-600" />
        <h2 className="text-xl font-bold text-gray-900">Energy vs Danceability vs Valence</h2>
        <div className="ml-auto text-xs text-gray-500">
          Bubble size = Streams, Color = Valence
        </div>
      </div>
      
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default BubbleChart;