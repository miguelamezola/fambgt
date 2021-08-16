import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { recurrenceRates,transactionTypes,getDateString } from '../utils';

export const TransactionEditor = ({dateRange, transaction}) => {
    const [show,setShow] = useState(false);

    const DEFAULT_DATE = new Date();

    const [id,setId] = useState("");
    const [title,setTitle] = useState("");
    const [type,setType] = useState(transactionTypes.EXPENSE);
    const [amount,setAmount] = useState(0.00);
    const [date,setDate] = useState(DEFAULT_DATE);
    const [recurrenceRate,setRecurrenceRate] = useState(recurrenceRates.NONE);

    const onOpen = () => {
        if (transaction) {
            setId(transaction.id);
            setTitle(transaction.title);
            setType(transaction.type);
            setAmount(transaction.amount);
            setDate(transaction.date);
            setRecurrenceRate(transaction.recurrenceRate);
        } else {
            setTitle('');
            setAmount('');
            setType(transactionTypes.EXPENSE);
            setDate(new Date());
            setRecurrenceRate("None");
        }
        setShow(true);
    }
    const onClose = () => {
        setShow(false);
    }

    const onSave = () => {
        let uuid = id;
        if(!uuid) {
            uuid = uuidv4();
            setId(uuid);
        }
        setShow(false);
    }

    const onAmountChanged = (event) => {
        if (event.target.value) {
            setAmount(parseFloat(event.target.value));
        } else {
            setAmount('');
        }
    }

    const isValid = () => title.length > 0 && amount > 0;
    const isDirty = () => !transaction || transaction.id !== id || transaction.title !== title || transaction.amount !== amount || transaction.date !== date || transaction.recurrenceRate !== recurrenceRate;

    return (
        <>
            <button type="button" className="btn btn-primary btn-sm" onClick={ onOpen }>Add Transaction</button>
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
                            <Form.Select name="recurrenceRate" value={recurrenceRate} onChange={(event) => setRecurrenceRate(event.target.value)}>
                                <option>{recurrenceRates.NONE}</option>
                                <option>{recurrenceRates.SEMI_MONTHLY}</option>
                                <option>{recurrenceRates.MONTHLY}</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" disabled={!isValid() && isDirty()} onClick={ onSave }>Save</Button>
                    <Button variant="secondary" onClick={ onClose }>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}