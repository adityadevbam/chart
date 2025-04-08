import React from "react";
import * as d3 from "d3";

function DonutChart({ data, categories, categoryField, width = 200, height = 200 }) {
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

  // Track total deal count per category
  const totalCountByCat = {};
  const totalACVByCat = {};
  let totalACV = 0;

  data.forEach((item) => {
    const cat = item[categoryField];
    totalCountByCat[cat] = (totalCountByCat[cat] || 0) + (item.count || 0);
    totalACVByCat[cat] = (totalACVByCat[cat] || 0) + (item.acv || 0);
    totalACV += item.acv || 0;
  });

  // Format numbers for readability
  const formatValue = (value) => (value >= 1000 ? (value / 1000).toFixed(1) + "K" : value.toString());

  // Prepare pie data (based on ACV)
  const pieData = categories.map((cat) => ({
    category: cat,
    value: totalACVByCat[cat] || 0, // Use ACV values
  }));

  // Generate pie chart arcs
  const pie = d3.pie().value((d) => d.value).sort(null);
  const arcs = pie(pieData);

  const arcGenerator = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
  const labelArc = d3.arc().innerRadius(radius * 1.1).outerRadius(radius * 1.3); // Labels positioned further out

  return (
    <svg width={width} height={height} overflow='visible'>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {arcs.map((arc, index) => {
          const labelCentroid = labelArc.centroid(arc);
          const percentage = totalACV ? ((arc.data.value / totalACV) * 100).toFixed(0) : "0.0";
          const isSmallSlice = arc.endAngle - arc.startAngle < 0.2; // Threshold for small slices
          const textYOffset = index % 2 === 0 ? -10 : 10; // Alternate vertical spacing to avoid overlap
          
          return (
            <g key={arc.data.category}>
              {/* Slice */}
              <path d={arcGenerator(arc)} fill={color(arc.data.category)} stroke="white" strokeWidth={1.5}>
                <title>{`${arc.data.category}: $${formatValue(arc.data.value)} (${percentage}%)`}</title>
              </path>
              
              {/* Labels positioned outside */}
              {arc.data.value > 0 && (
                <>
                  <text
                    x={labelCentroid[0]}
                    y={labelCentroid[1] + textYOffset - 5}
                    textAnchor="middle"
                    fontSize={12}
                    fill="black"
                    fontWeight="bold"
                    transform={isSmallSlice ? `rotate(-90, ${labelCentroid[0]}, ${labelCentroid[1.2]})` : ""}
                  >
                    ${formatValue(arc.data.value)}
                  </text>
                  <text
                    x={labelCentroid[0]}
                    y={labelCentroid[1] + textYOffset + 10}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight="semi-bold"
                    transform={isSmallSlice ? `rotate(-90, ${labelCentroid[0]}, ${labelCentroid[1.2] + 14})` : ""}
                  >
                    ({percentage}%)
                  </text>
                </>
              )}
            </g>
          );
        })}
        
        {/* Display Total ACV in center */}
        <text textAnchor="middle" fontSize={14} fontWeight="bold" dy={5}>
          <tspan x="0" dy="0">Total</tspan>
          <tspan x="0" dy={16}>${formatValue(parseInt(totalACV))}</tspan>
        </text>
      </g>
    </svg>
  );
}

export default DonutChart;
