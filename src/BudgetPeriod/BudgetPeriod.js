import './BudgetPeriod.css';

const BudgetPeriod = ({data}) => {
    const formattedStartDate = data.start ? data.start.toISOString().split('T')[0] : 'Unknown';
    const formattedEndDate = data.end ? data.end.toISOString().split('T')[0] : 'Unknown';

    data.transactions.sort((a,b) => {
        let result = 0;
        if (a.date < b.date) {
            result = -1;
        } else if (a.date > b.date) {
            result = 1;
        }
        return result;
    });

    return (
        <div className="col-md-6 budget-period">
            <p><strong>Start Date:</strong> {formattedStartDate}, <strong>End Date:</strong> {formattedEndDate}</p>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Title</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.transactions.map(t => (
                        <tr key={ t.id }>
                            <th scope="row">{ `${t.date.getMonth()}/${t.date.getDate()}` }</th>
                            <td>{ t.title }</td>
                            <td>{ t.amount.toFixed(2) }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BudgetPeriod;