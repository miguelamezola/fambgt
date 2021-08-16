import React, { useEffect, useState } from 'react';
import { getDateString } from '../utils';
import './BudgetPeriod.css';

export const BudgetPeriod = ({data}) => {
    const WEEK_LEN_IN_DAYS = 7;

    const [transactions,setTransactions] = useState([]);

    useEffect(() => {
        fetch('data-2.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            let queriedTransactions = [];

            json.transactions.forEach(el => {
                let date = new Date(el.date);
                date.setHours(0,0,0,0);

                const recurrenceRate = el.recurrenceRate.split(' ');
                switch (recurrenceRate[1]) {                
                    case "weeks":
                        const numWeeks = parseInt(recurrenceRate[0]);
                        while(date <= data.end) {
                            date.setDate(date.getDate() + (numWeeks * WEEK_LEN_IN_DAYS));
                        }    
                        date.setDate(date.getDate() - (numWeeks * WEEK_LEN_IN_DAYS));
                        break;
                    case "month":
                    case "months":
                    default:
                        const numMonths = parseInt(recurrenceRate[0]);                    
                        while(date <= data.end) {
                            date.setMonth(date.getMonth() + numMonths);
                        }
                        date.setMonth(date.getMonth() - numMonths);
                        break;           
                }

                if (data.start <= date && date <= data.end) {
                    queriedTransactions.push({
                        id: el.id,
                        date: date,
                        title: el.title,
                        amount: el.amount,
                        type: el.type
                    });
                }
            });

            queriedTransactions.sort((a,b) => {
                let result = 0;
                if (a.date < b.date) {
                    result = -1;
                } else if (a.date > b.date) {
                    result = 1;
                }
                return result;
            });

            setTransactions(queriedTransactions);
        });
    }, [data]);

    return (
        <div className="col-md-6 budget-period">
            <p>{getDateString(data.start)} to {getDateString(data.end)}</p>

            <table className="table table-sm">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Title</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={ t.id }>
                            <th scope="row">{ `${(new Date(t.date)).getMonth()}/${(new Date(t.date)).getDate()}` }</th>
                            <td>{ t.title }</td>
                            <td>{ t.amount.toFixed(2) }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}