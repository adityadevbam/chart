import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DynamicTable = ({ data, categories, quarters, categoryField }) => {


    // Compute total ACV and count per quarter
    const quarterTotals = {};
    let grandTotalCount = 0;
    let grandTotalACV = 0;

    quarters.forEach(quarter => {
        quarterTotals[quarter] = { totalCount: 0, totalACV: 0 };
    });

    data.forEach(row => {
        if (quarterTotals[row.closed_fiscal_quarter]) {
            quarterTotals[row.closed_fiscal_quarter].totalCount += row.count;
            quarterTotals[row.closed_fiscal_quarter].totalACV += row.acv;
        }
    });

    // Compute grand totals (Sum of all quarters)
    Object.values(quarterTotals).forEach(({ totalCount, totalACV }) => {
        grandTotalCount += totalCount;
        grandTotalACV += totalACV;
    });

    // Step 2: Define table columns
    let columns = [
        {
            Header: "Closed Fiscal Year",
            subHeaders: [categoryField], // First column (static)
        },
        ...quarters.map(quarter => ({
            Header: quarter,
            subHeaders: ["# of Opps", "ACV", "% of Total"], // These remain static
        })),
        {
            Header: "Total",
            subHeaders: ["# of Opps", "ACV", "% of Total"], // Final total column
        },
    ];

    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: "auto", mt: 3 }}>
            <Table>
                {/* Table Header */}
                <TableHead>
                    {/* First Row - Main Headers */}
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableCell
                                key={index}
                                colSpan={column.subHeaders.length}
                                sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white", textAlign: "center" , border : 1}}
                            >
                                {column.Header} 
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Second Row - Subheaders */}
                    <TableRow>
                        {columns.flatMap((column, index) =>
                            column.subHeaders.map((subHeader, subIndex) => (
                                <TableCell
                                    key={`${index}-${subIndex}`}
                                    sx={{ fontWeight: "bold", textAlign: "center", border : 1 }}
                                >
                                    {subHeader}
                                </TableCell>
                            ))
                        )}
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {categories.map((category, rowIndex) => {
                        let rowTotalCount = 0;
                        let rowTotalACV = 0;

                        return (
                            <TableRow key={rowIndex}>
                                {/* First Column - Categories */}
                                <TableCell sx={{ fontWeight: "bold", border: 1, textAlign: "center" }}>
                                    {category}
                                </TableCell>

                                {/* Populate Quarter Data */}
                                {quarters.flatMap(quarter => {
                                    // Find matching data row
                                    const rowData = data.find(row => row.closed_fiscal_quarter === quarter && row[categoryField] === category);
                                    const count = rowData ? rowData.count : 0;
                                    const acv = rowData ? rowData.acv : 0;

                                    // Update row total
                                    rowTotalCount += count;
                                    rowTotalACV += acv;

                                    // Calculate vertical percentage (within the quarter)
                                    const totalACV = quarterTotals[quarter].totalACV;
                                    const percentage = totalACV ? ((acv / totalACV) * 100).toFixed(2) : "0.00";

                                    return [
                                        <TableCell key={`${quarter}-count`} sx={{ textAlign: "right" , border : 1 }}>{count}</TableCell>,
                                        <TableCell key={`${quarter}-acv`} sx={{ textAlign: "right" , border : 1 }}>${parseInt(acv).toLocaleString()}</TableCell>,
                                        <TableCell key={`${quarter}-percent`} sx={{ textAlign: "right" , border : 1 }}>{percentage}%</TableCell>,
                                    ];
                                })}

                                {/* Row Total (Horizontal Sum) */}
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" , border : 1 }}>{rowTotalCount}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" , border : 1 }}>${parseInt(rowTotalACV).toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" , border : 1 }}>
                                    {grandTotalACV
                                        ? ((rowTotalACV / grandTotalACV) * 100).toFixed(2)
                                        : "0.00"}
                                    %
                                </TableCell>
                            </TableRow>
                        );
                    })}

                    {/* Total Row (Final Totals) */}
                    <TableRow sx={{fontWeight: "bold"  }}>
                        <TableCell sx={{ textAlign: "center", fontWeight: "bold" , border : 1 }}>Total</TableCell>

                        {quarters.flatMap(quarter => {
                            const totalCount = quarterTotals[quarter].totalCount;
                            const totalACV = quarterTotals[quarter].totalACV;

                            return [
                                <TableCell key={`${quarter}-total-count`} sx={{ textAlign: "right", fontWeight: "bold" , border : 1 }}>
                                    {totalCount}
                                </TableCell>,
                                <TableCell key={`${quarter}-total-acv`} sx={{ textAlign: "right", fontWeight: "bold" , border : 1 }}>
                                    ${parseInt(totalACV).toLocaleString()}
                                </TableCell>,
                                <TableCell key={`${quarter}-total-percent`} sx={{ textAlign: "right", fontWeight: "bold", border : 1  }}>
                                    100%
                                </TableCell>,
                            ];
                        })}

                        {/* Grand Total (Final Column) */}
                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" , border : 1  }}>{grandTotalCount}</TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" , border : 1 }}>${parseInt(grandTotalACV).toLocaleString()}</TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "right", border : 1  }}>100%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DynamicTable;
