import './BudgetMaker.css';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BudgetPeriod } from '../BudgetPeriod/BudgetPeriod';
import { TransactionEditor } from '../TransactionEditor/TransactionEditor';
import { recurrenceRates } from '../utils';

export const BudgetMaker = () => {
    const TWO_WEEKS_IN_DAYS = 14;

    const [dateRange,setDateRange] = useState({});
    const [budgetPeriods,setBudgetPeriods] = useState([]);

    useEffect(() => {
        console.log('BudgetMaker');
        fetch('data-1.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            let periods = [];

            let secondStart = new Date(json.budgetPeriod.origin);
            secondStart.setHours(0,0,0,0);
            while (secondStart < Date.now()) {
                secondStart.setDate(secondStart.getDate() + TWO_WEEKS_IN_DAYS);
            }

            let secondEnd = new Date();
            secondEnd.setHours(0,0,0,0);
            secondEnd.setDate(secondStart.getDate() + (TWO_WEEKS_IN_DAYS - 1));

            periods.push({
                id: uuidv4(),                
                start: secondStart,
                end: secondEnd,
                transactions: filterTransactions(json.transactions, secondStart, secondEnd)
            });

            let firstStart = new Date();
            firstStart.setHours(0,0,0,0);
            firstStart.setDate(secondStart.getDate() - TWO_WEEKS_IN_DAYS);

            let firstEnd = new Date();
            firstEnd.setHours(0,0,0,0);
            firstEnd.setDate(firstStart.getDate() + (TWO_WEEKS_IN_DAYS - 1))

            periods.push({
                id: uuidv4(),
                start: firstStart,
                end: firstEnd,
                transactions: filterTransactions(json.transactions, firstStart, firstEnd)
            });

            periods.sort((a,b) => {
                let result = 0;
                if (a.start < b.start) {
                    result = -1;
                } else if (a.start > b.start) {
                    result = 1;
                }
                return result;
            });

            setBudgetPeriods(periods);

            const range = {
                start: firstStart,
                end: secondEnd
            }

            setDateRange(range);
        });
    },[]);

    const filterTransactions = (transactions, start, end) => {
        let filtered_transactions = []
        transactions.forEach((t) => {
            let date = new Date(t.date);
            date.setHours(0,0,0,0);

            switch (t.recurrenceRate) {
                case recurrenceRates.SEMI_MONTHLY:
                    while(date < start) {
                        date.setDate(date.getDate() + TWO_WEEKS_IN_DAYS);
                    }
                    break;
                case recurrenceRates.MONTHLY:
                    while(date < start) {
                        date.setMonth(date.getMonth() + 1);
                    }
                    break;
            }

            if (start <= date && date <= end) {
                filtered_transactions.push({
                    id: t.id,
                    date: date,
                    title: t.title,
                    amount: t.amount,
                    type: t.type
                })
            }
        });
        return filtered_transactions;
    }

    const onAddOrUpdate = (transaction) => {
        let modifiedBudgetPeriods = [];
        budgetPeriods.forEach(bp => {
            if (bp.start <= transaction.date && transaction.date <= bp.end) {
                bp.transactions.push(transaction);
            }
            modifiedBudgetPeriods.push(bp);
        });
        setBudgetPeriods(modifiedBudgetPeriods);
    }

    return (
        <div className="container">
            <div className="row budget-maker-header">
                <h1>Budget Maker</h1>                
                <div>
                    <TransactionEditor dateRange={dateRange} onAddOrUpdate={onAddOrUpdate} />
                </div>
            </div>
            <div className="row">
                {budgetPeriods && budgetPeriods.map(period => (<BudgetPeriod key={period.id} start={period.start} end={period.end} transactions={period.transactions} />))}
            </div>
        </div>
    );
}