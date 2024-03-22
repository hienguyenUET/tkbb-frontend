import '../style-css/custom-table.css'

const CustomTable = ({data, columns}) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column.headerName}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex): void => (
                    <tr key={rowIndex}>
                        {columns.map((column, columnIndex) => (
                            <td key={columnIndex}>{column.customRender ? column.customRender(row) : row[column.field]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default CustomTable
