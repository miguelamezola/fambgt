import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { recurrenceRates,transactionTypes,getDateString, modifyActions, addMonths } from '../utils';

export const TransactionEditor = ({onModify, minimized, dateRange, transaction}) => {
    const [show,setShow] = useState(false);

    const DEFAULT_DATE = new Date();

    const [transactionId,setTransactionId] = useState('');
    const [title,setTitle] = useState('');
    const [type,setType] = useState(transactionTypes.EXPENSE);
    const [amount,setAmount] = useState(0.00);
    const [date,setDate] = useState(DEFAULT_DATE);
    const [recurrenceRate,setRecurrenceRate] = useState(transaction ? transaction.recurrenceRate : recurrenceRates.NONE);
    const [recurrenceEndDate,setRecurrenceEndDate] = useState();
    const [recurrenceSeriesId,setRecurrenceSeriesId] = useState();
    const [confirmDelete,setConfirmDelete] = useState(false);

    const onOpen = () => {
        if (transaction) {
            setTransactionId(transaction.id);
            setTitle(transaction.title);
            setType(transaction.type);
            setAmount(transaction.amount);
            setDate(transaction.date);
            setRecurrenceSeriesId(transaction.recurrence.id);
            setRecurrenceRate(transaction.recurrence.rate);
            setRecurrenceEndDate(transaction.recurrence.endDate);
        } else {
            setType(transactionTypes.EXPENSE);
            setDate(DEFAULT_DATE);
            setRecurrenceRate("None");
        }
        setShow(true);
    }
    const onClose = () => {
        setShow(false);
    }

    const onSave = () => {
        let id = transactionId;
        if (!id) {
            id = uuidv4();
            setTransactionId(id);
        }
        let seriesId = recurrenceSeriesId;
        if (recurrenceRate !== recurrenceRates.NONE) {
            if (!seriesId) {
                seriesId = uuidv4();
                setRecurrenceSeriesId(seriesId);
            }
            setRecurrenceEndDate(addMonths(new Date(), 3));
        }
        onModify({
            action: modifyActions.addOrUpdate,
            transaction: {
                id: id,
                title: title,
                amount: amount,
                type: type,
                date: date,
                recurrence: {
                    id: seriesId,
                    rate: recurrenceRate,
                    endDate: recurrenceEndDate
                }
            }
        });
        setShow(false);
    }

    const onDelete = () => {
        onModify({
            action: modifyActions.delete,
            transaction: {
                id: transactionId
            },
            validate: false
        });
        setConfirmDelete(false);
        setShow(false);
    }

    const onConfirmDelete = () => {
        setShow(false);
        setConfirmDelete(true);
    }

    const onCancelConfirmDelete = () => {
        setConfirmDelete(false);
        setShow(true);
    }

    const onAmountChanged = (event) => {
        if (event.target.value) {
            setAmount(parseFloat(event.target.value));
        } else {
            setAmount('');
        }
    }

    const onRecurrenceRateChanged = (e) => {
        setRecurrenceRate(e.target.value)
        if (e.target.value === recurrenceRates.NONE) {
            setRecurrenceSeriesId(undefined);
            setRecurrenceEndDate(undefined);
        } else {
            setRecurrenceEndDate(addMonths(new Date(), 3));
        }
    }

    const isValid = () => title.length > 0 && amount > 0;
    const isDirty = () => !transaction || transaction.id !== transactionId || transaction.title !== title || transaction.amount !== amount || transaction.date !== date || transaction.recurrenceRate !== recurrenceRate;

    return (
        <>
            {minimized ?
                <svg onClick={ onOpen } xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
                :
                <button  onClick={ onOpen } type="button" className="btn btn-primary btn-sm">Add Transaction</button>
            }

            <Modal show={ show } onHide={ onClose } centered>
                <Modal.Header closeButton>
                    <Modal.Title>Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select name="type" value={type} onChange={(event) => setType(event.target.value)}>
                                <option>{transactionTypes.INCOME}</option>
                                <option>{transactionTypes.EXPENSE}</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" placeholder="Enter Title Here" value={ title } onChange={(event) => setTitle(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control name="amount" type="number" min={0} step="0.01" placeholder="Enter Dollar Amount Here" value={ amount } onChange={onAmountChanged} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control name="date" type="date" min={getDateString(dateRange.start)} max={getDateString(dateRange.end)} value={getDateString(date)} onChange={(event) => setDate(new Date(`${event.target.value}T07:00:00.000Z`)) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Recurrence Rate</Form.Label>
                            <Form.Select name="recurrenceRate" value={recurrenceRate} onChange={ onRecurrenceRateChanged }>
                                <option>{recurrenceRates.NONE}</option>
                                <option>{recurrenceRates.SEMI_MONTHLY}</option>
                                <option>{recurrenceRates.MONTHLY}</option>
                            </Form.Select>
                        </Form.Group>
                        {
                            recurrenceRate !== recurrenceRates.NONE ?
                            <Form.Group className="mb-3">
                                <Form.Label>Recurrence End Date</Form.Label>
                                <Form.Control name="recurrenceEndDate" type="date" min={getDateString(dateRange.end)} value={getDateString(recurrenceEndDate)} onChange={(event) => setRecurrenceEndDate(new Date(`${event.target.value}T07:00:00.000Z`)) } />
                            </Form.Group> :
                            null
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" disabled={!isValid() && isDirty()} onClick={ onSave }>Save</Button>
                    {transaction && <Button variant="danger" onClick={ onConfirmDelete }>Delete</Button>}
                    <Button variant="secondary" onClick={ onClose }>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={ confirmDelete } onHide={ onCancelConfirmDelete } centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you really want to permanently delete this transaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={ onDelete }>Delete</Button>
                    <Button variant="secondary" onClick={ onCancelConfirmDelete }>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}