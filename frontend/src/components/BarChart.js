import React from 'react';
import * as d3 from 'd3';

function BarChart({ data, categories, quarters, categoryField, width = 500, height = 300 }) {
  // Margins around the chart area for axes labels
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  

  // D3 scales for X (quarters and categories) and Y (ACV values)
  const x0 = d3.scaleBand()
    .domain(quarters)
    .range([0, innerWidth])
    .padding(0.1);
  const x1 = d3.scaleBand()
    .domain(categories)
    .range([0, x0.bandwidth()])
    .padding(0.05);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.acv)])  // domain from 0 to max ACV value
    .nice()                                 // nice() for rounded domain (e.g., round to neat numbers)
    .range([innerHeight, 0]);
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

  // Prepare a mapping of [quarter][category] -> data item for quick lookup
  const dataMap = {};
  data.forEach(item => {
    const q = item.closed_fiscal_quarter;
    const cat = item[categoryField];
    if (!dataMap[q]) dataMap[q] = {};
    dataMap[q][cat] = item;
  });

  // Generate Y-axis tick values and formatter for large numbers (e.g., convert 1000000 to "1.0M")
  const yTicks = y.ticks(5);
  const formatTicks = d3.format(".2s");  // e.g., 1.3M, 500k

  return (
    <svg width={width} height={height}>
      {/* Chart area group with translation for margins */}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Draw grouped bars for each quarter and category */}
        {quarters.map(quarter =>
          categories.map(category => {
            const item = dataMap[quarter] ? dataMap[quarter][category] : null;
            const acvValue = item ? item.acv : 0;
            const barHeight = innerHeight - y(acvValue);  // height from value

            const barWidth = x1.bandwidth();

            //condition to check if tthe bar is too thin
            const isThin = barWidth < 12;
            const textYOffset = isThin ? -10 : 15; // Move text above if thin
            const textRotation = isThin ? -90 : 0; // Rotate text if thin
            
            return (
              <g key={`${quarter}-${category}`}>
              <rect
                key={`${quarter}-${category}`}
                x={x0(quarter) + x1(category)}
                y={y(acvValue)}
                width={x1.bandwidth()}
                height={barHeight}
                fill={color(category)}
              >
                {/* Tooltip (title) shows category, quarter and ACV on hover */}
                <title>
                  {`${category} – ${quarter}: $${acvValue.toFixed(2)}`}
                </title>             
              </rect>

              <text
                x={x0(quarter) + x1(category) + x1.bandwidth() / 2}
                  y={y(acvValue) - 5} // Slightly above the bar
                  textAnchor='middle'
                  fontSize={ isThin ? 10 : 12}
                  fontWeight='semi-bold'
                  fill="black"
                  transform={`rotate(${textRotation}, ${x0(quarter) + x1(category) + barWidth / 2}, ${y(acvValue) + textYOffset})`}
              >
                {formatTicks(acvValue)}
              </text>
            </g> 
            
             
            );
          })
        )}
        {/* X-axis labels (quarters) */}
        {quarters.map(q => (
          <text 
            key={q} 
            x={x0(q) + x0.bandwidth() / 2} 
            y={innerHeight + 20} 
            textAnchor="middle"
            fontSize={12}
          >
            {q}
          </text>
        ))}
        {/* Y-axis labels (ACV scale) and horizontal guide lines */}
        {yTicks.map(val => (
          <g key={val}>
            {/* horizontal line for reference */}
            <line 
              x1={0} x2={innerWidth} 
              y1={y(val)} y2={y(val)} 
              stroke="#ccc" 
              strokeWidth={0.5} 
            />
            {/* text label for the tick */}
            <text 
              x={-5} 
              y={y(val)} 
              textAnchor="end" 
              fontSize={11} 
              dy="0.32em"  /* vertically center text on the line */
            >
              {formatTicks(val)}
            </text>
          </g>
        ))}
        {/* Y-axis title (ACV in $) rotated vertically */}
        <text 
          transform={`translate(${-40}, ${innerHeight/2}) rotate(-90)`} 
          textAnchor="middle" 
          fontSize={12}
        >
          ACV ($)
        </text>
      </g>
    </svg>
  );
}

export default BarChart;
