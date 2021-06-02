import React, { ReactElement } from "react";
import "./Table.css";

interface Props {
    tableHeaders: String[];
    tableRows: object[];
}

function Table({ tableHeaders, tableRows }: Props): ReactElement {
    return (
        <div className="wrap-table100">
            <div className="table100">
                <table>
                    <thead>
                        <tr className="table100-head">
                            {tableHeaders.map((tableHeader) => {
                                return (
                                    <th className="column1">{tableHeader}</th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map((tableRow: object) => {
                            return (
                                <tr>
                                    {Object.values(tableRow).map(
                                        (tableRowItem) => {
                                            return (
                                                <td className="column1">
                                                    {tableRowItem}
                                                </td>
                                            );
                                        }
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
