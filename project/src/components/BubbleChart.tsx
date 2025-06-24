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

    const margin = { top: 20, right: 40, bottom: 40, left: 200 };
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Ambil 10 track teratas berdasarkan in_spotify_playlists
    const data = tracks
      .filter(t => typeof t.in_spotify_playlists === 'number')
      .sort((a, b) => b.in_spotify_playlists - a.in_spotify_playlists)
      .slice(0, 10);

    // Skala
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.in_spotify_playlists) || 1])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.track_name))
      .range([0, height])
      .padding(0.2);

    // Skala warna gradien
    const colorScale = d3.scaleLinear<string>()
      .domain([
        d3.min(data, d => d.in_spotify_playlists) || 0,
        d3.max(data, d => d.in_spotify_playlists) || 1
      ])
      .range(["#fde68a", "#fbbf24", "#a21caf"]);

    // Sumbu X
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .selectAll("text")
      .attr("font-size", 12);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 35)
      .attr("fill", "#6b7280")
      .style("text-anchor", "middle")
      .text("Track In Spotify Playlists");

    // Sumbu Y
    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .attr("font-size", 13)
      .attr("fill", "#6b7280");

    // Bar
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => yScale(d.track_name) || 0)
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("width", d => xScale(d.in_spotify_playlists))
      .attr("fill", d => colorScale(d.in_spotify_playlists))
      .attr("rx", 6);

    // Label nilai di ujung bar
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.in_spotify_playlists) + 8)
      .attr("y", d => (yScale(d.track_name) || 0) + yScale.bandwidth() / 2 + 4)
      .text(d => d.in_spotify_playlists)
      .attr("fill", "#92400e")
      .attr("font-size", 12);

  }, [tracks]);

  return (
    <div className="bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-lg border border-yellow-200/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-yellow-600" />
        <h2 className="text-xl font-bold text-gray-900">Top 10 Tracks by Spotify Playlists</h2>
        <div className="ml-auto text-xs text-gray-500">
          Bar Chart: Playlist / track
        </div>
      </div>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default BubbleChart;