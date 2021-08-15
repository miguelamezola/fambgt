import './BudgetMaker.css';
import React, { useEffect, useState } from 'react';
import BudgetPeriod from '../BudgetPeriod/BudgetPeriod';
import IncomeForm from '../IncomeForm/IncomeForm';
import ExpenseForm from '../ExpenseForm/ExpenseForm';

import { v4 as uuidv4 } from 'uuid';


const BudgetMaker = () => {
    const LEN_BUDGET_PERIOD_IN_DAYS = 14;
    const WEEK_LEN_IN_DAYS = 7;

    const [budgetItems, setBudgetItems] = useState({});
    const [budgetPeriodStartDates, setBudgetPeriodStartDates] = useState([]);

    const getData = () => {
        fetch('data.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            setBudgetItems(json);

            let dates = [];

            let secondPayPeriod = new Date(json.budgetPeriod.origin);
            secondPayPeriod.setHours(0,0,0,0);
            while (secondPayPeriod < Date.now()) {
                secondPayPeriod.setDate(secondPayPeriod.getDate() + LEN_BUDGET_PERIOD_IN_DAYS);
            }
            dates.push(secondPayPeriod);

            let firstPayPeriod = new Date();
            firstPayPeriod.setHours(0,0,0,0);
            firstPayPeriod.setDate(secondPayPeriod.getDate() - LEN_BUDGET_PERIOD_IN_DAYS);
            dates.push(firstPayPeriod);

            setBudgetPeriodStartDates(dates);
        });
    };

    useEffect(() => {
        getData();
    }, []);

    let budgetPeriods = [];
    for(let i = 0; i < budgetPeriodStartDates.length; i++) {
        budgetPeriodStartDates[i].setHours(0,0,0,0);

        let endDate = new Date();
        endDate.setDate(budgetPeriodStartDates[i].getDate() + (LEN_BUDGET_PERIOD_IN_DAYS - 1));
        endDate.setHours(0,0,0,0);

        const budgetPeriod = {
            id: uuidv4(),
            start: budgetPeriodStartDates[i],
            end: endDate,
            income: [],
            expenses: [],
            transactions: []
        };

        budgetItems.transactions.forEach(el => {
            let date = new Date(el.date);
            date.setHours(0,0,0,0);

            const recurrenceRate = el.recurrenceRate.split(' ');
            switch (recurrenceRate[1]) {                
                case "weeks":
                    const numWeeks = parseInt(recurrenceRate[0]);
                    while(date <= budgetPeriod.end) {
                        date.setDate(date.getDate() + (numWeeks * WEEK_LEN_IN_DAYS));
                    }    
                    date.setDate(date.getDate() - (numWeeks * WEEK_LEN_IN_DAYS));
                    break;
                case "month":
                case "months":
                default:
                    const numMonths = parseInt(recurrenceRate[0]);                    
                    while(date <= budgetPeriod.end) {
                        date.setMonth(date.getMonth() + numMonths);
                    }
                    date.setMonth(date.getMonth() - numMonths);
                    break;           
            }

            if (budgetPeriod.start <= date && date <= budgetPeriod.end) {
                budgetPeriod.transactions.push({
                    id: el.id,
                    date: date,
                    title: el.title,
                    amount: el.amount,
                    type: el.type
                });
            }
        });

        budgetPeriods.push(budgetPeriod);
    }

    budgetPeriods.sort((a,b) => {
        let result = 0;
        if (a.start < b.start) {
            result = -1;
        } else if (a.start > b.start) {
            result = 1;
        }
        return result;
    });

    const onAddOrUpdateIncome = (income) => {
        console.log(income);
    }

    return (
        <div className="container">
            <div className="row budget-maker-header">
                <h1>Budget Maker</h1>                
                <div>
                    <IncomeForm onAddOrUpdate={onAddOrUpdateIncome} />
                    <ExpenseForm onAddOrUpdate={onAddOrUpdateIncome} />
                </div>
            </div>
            <div className="row">
                {budgetPeriods.map(period => (<BudgetPeriod key={period.id} data={period} />))}
            </div>
        </div>
    );
}

export default BudgetMaker;