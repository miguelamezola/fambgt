import './BudgetMaker.css';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { BudgetPeriod } from '../BudgetPeriod/BudgetPeriod';
import { TransactionEditor } from '../TransactionEditor/TransactionEditor';
import { recurrenceRates, modifyActions } from '../utils';

export const BudgetMaker = () => {
    const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
    const TWO_WEEKS_IN_MS = ONE_DAY_IN_MS * 14;
    const [dateRange,setDateRange] = useState({});
    const [budgetPeriods,setBudgetPeriods] = useState([]);
    const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false);
    const [selectedTransaction,setSelectedTransaction] = useState(null); // selected transaction's id

    useEffect(() => {
        const filterTransactions = (transactions, start, end) => {
            let filtered_transactions = []
            transactions.forEach((t) => {
                let date = new Date(t.date);
                date.setHours(0,0,0,0);

                switch (t.recurrenceRate) {
                    case recurrenceRates.SEMI_MONTHLY:
                        while(date < start) {
                            date = new Date(date.getTime() + TWO_WEEKS_IN_MS);
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
            // compute start and end dates for the first and second budget periods
            let secondStart = new Date(json.budgetPeriod.origin);
            while (secondStart < Date.now()) {
                secondStart = new Date(secondStart.getTime() + TWO_WEEKS_IN_MS)
            }
            let secondEnd = new Date(secondStart.getTime() + TWO_WEEKS_IN_MS - ONE_DAY_IN_MS);
            let firstStart = new Date(secondStart.getTime() - TWO_WEEKS_IN_MS);
            let firstEnd = new Date(secondStart.getTime() - ONE_DAY_IN_MS);

            // adjust the time of date
            firstStart.setHours(0,0,0,0);
            firstEnd.setHours(0,0,0,0);
            secondStart.setHours(0,0,0,0);
            secondEnd.setHours(0,0,0,0);

            // add budget periods
            setBudgetPeriods([{
                    id: uuidv4(),
                    start: firstStart,
                    end: firstEnd,
                    transactions: filterTransactions(json.transactions, firstStart, firstEnd)
                },{
                    id: uuidv4(),
                    start: secondStart,
                    end: secondEnd,
                    transactions: filterTransactions(json.transactions, secondStart, secondEnd)
                }
            ]);
            // date range containing all budget periods
            setDateRange({
                start: firstStart,
                end: secondEnd
            });
        });
    },[TWO_WEEKS_IN_MS, ONE_DAY_IN_MS]);

    const onModify = (modification) => {
        switch (modification.action) {
            case modifyActions.addOrUpdate:
                let modifiedBudgetPeriods = [];
                budgetPeriods.forEach(bp => {
                    if (bp.start <= modification.transaction.date && modification.transaction.date <= bp.end) {
                        let existingTransaction = bp.transactions.find(t => t.id === modification.transaction.id)
                        if (existingTransaction) {
                            for (const [key, value] of Object.entries(modification.transaction)) {
                                existingTransaction[key] = value;
                            }
                        } else {
                            bp.transactions.push(modification.transaction);
                        }
                    }
                    modifiedBudgetPeriods.push(bp);
                });
                setBudgetPeriods(modifiedBudgetPeriods);
                break;

            case modifyActions.delete:
                if (modification.validate === undefined || modification.validate) {
                    setSelectedTransaction(modification.transaction.id);
                    setShowDeleteConfirmation(true);
                } else {
                    removeBudgetPeriod(modification.transaction.id);
                }
                break;
        }
    }

    const onHardDelete = () => {
        removeBudgetPeriod(selectedTransaction);
        setShowDeleteConfirmation(false);
        setSelectedTransaction(null);
    }

    const removeBudgetPeriod = (id) => {
        let modifiedBudgetPeriods = [];
        budgetPeriods.forEach(bp => {
            for (let i = 0; i < bp.transactions.length; i++) {
                if (bp.transactions[i].id === id) {
                    bp.transactions.splice(i, 1);
                }
            }
            modifiedBudgetPeriods.push(bp);
        });
        setBudgetPeriods(modifiedBudgetPeriods);
    }

    const onClose = () => {
        setShowDeleteConfirmation(false);
        setSelectedTransaction(null);
    }

    return (
        <>
            <div className="container">
                <div className="row budget-maker-header">
                    <h1>Budget Maker</h1>
                    <div>
                        <TransactionEditor onModify={onModify} dateRange={dateRange} />
                    </div>
                </div>
                <div className="row">
                    {budgetPeriods && budgetPeriods.map(period => (<BudgetPeriod key={period.id} onModify={onModify} start={period.start} end={period.end} transactions={period.transactions} />))}
                </div>
            </div>
            <Modal show={ showDeleteConfirmation } onHide={ onClose } centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you really want to permanently delete this transaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={ onHardDelete }>Delete</Button>
                    <Button variant="secondary" onClick={ onClose }>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}