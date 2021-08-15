import './BudgetMaker.css';
import React, { useEffect, useState } from 'react';
import BudgetPeriod from '../BudgetPeriod/BudgetPeriod';
import TransactionEditor from '../TransactionEditor/TransactionEditor';

import { v4 as uuidv4 } from 'uuid';


const BudgetMaker = () => {
    const LEN_BUDGET_PERIOD_IN_DAYS = 14;

    const [budgetPeriods,setBudgetPeriods] = useState([]);

    useEffect(() => {
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
                secondStart.setDate(secondStart.getDate() + LEN_BUDGET_PERIOD_IN_DAYS);
            }

            let secondEnd = new Date();
            secondEnd.setHours(0,0,0,0);
            secondEnd.setDate(secondStart.getDate() + (LEN_BUDGET_PERIOD_IN_DAYS - 1));

            periods.push({
                id: uuidv4(),                
                start: secondStart,
                end: secondEnd
            });

            let firstStart = new Date();
            firstStart.setHours(0,0,0,0);
            firstStart.setDate(secondStart.getDate() - LEN_BUDGET_PERIOD_IN_DAYS);

            let firstEnd = new Date();
            firstEnd.setHours(0,0,0,0);
            firstEnd.setDate(firstStart.getDate() + (LEN_BUDGET_PERIOD_IN_DAYS - 1))

            periods.push({
                id: uuidv4(),
                start: firstStart,
                end: firstEnd
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
        });
    },[]);

    return (
        <div className="container">
            <div className="row budget-maker-header">
                <h1>Budget Maker</h1>                
                <div>
                    <TransactionEditor />
                </div>
            </div>
            <div className="row">
                {budgetPeriods.map(period => (<BudgetPeriod key={period.id} data={period} />))}
            </div>
        </div>
    );
}

export default BudgetMaker;