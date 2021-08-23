import './BudgetPeriod.css';
import { Table } from "react-bootstrap";
import { getDateString } from '../utils';
import { TransactionEditor } from '../TransactionEditor/TransactionEditor';

export const BudgetPeriod = ({start,end,transactions,onModify}) => {
    const range = {
        start: start,
        end: end
    }
    return (
        <div className="col-md-6 budget-period">
            <p>{getDateString(start)} to {getDateString(end)}</p>

            <Table striped>
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Title</th>
                        <th className="text-end" scope="col">Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.sort((a,b) => {
                        let res = 0;
                        if (a.date < b.date) res = -1;
                        else if (a.date > b.date) res = 1;
                        return res;
                    }).map(t => (
                        <tr key={ t.id }>
                            <th scope="row">{ `${(new Date(t.date)).getMonth() + 1}/${(new Date(t.date)).getDate()}` }</th>
                            <td>{ t.title }</td>
                            <td className="text-end">{ t.amount.toFixed(2) }</td>
                            <td><TransactionEditor onModify={onModify} minimized={true} dateRange={range} transaction={t} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}