import './BudgetPeriod.css';
import { Table } from "react-bootstrap";
import { getDateString, modifyActions } from '../utils';
import { TransactionEditor } from '../TransactionEditor/TransactionEditor';

export const BudgetPeriod = ({start,end,transactions,onModify}) => {
    const range = {
        start: start,
        end: end
    }
    const onDelete = (id) => {
        onModify({
            action: modifyActions.delete,
            transaction: {
                id: id
            }
        });
    }
    return (
        <div className="col-md-6 budget-period">
            <p>{getDateString(start)} to {getDateString(end)}</p>

            <Table striped>
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Type</th>
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
                            <td>{ t.type }</td>
                            <td>{ t.title }</td>
                            <td className="text-end">{ t.amount.toFixed(2) }</td>
                            <td>
                                <TransactionEditor onModify={onModify} minimized={true} dateRange={range} transaction={t} />
                                &nbsp;&nbsp;
                                <svg onClick={ () => onDelete(t.id) } xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}