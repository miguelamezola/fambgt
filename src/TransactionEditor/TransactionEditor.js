import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { v4 as uuidv4 } from 'uuid';

const recurrenceRates = {
    NONE: "None",
    SEMI_MONTHLY: "2 weeks",
    MONTHLY: "1 month"
}

const TransactionEditor = ({transaction}) => {
    const TRANSACTION_TYPE = "expense";
    const [show,setShow] = useState(false);

    const DEFAULT_DATE = new Date();

    const [id,setId] = useState("");
    const [title,setTitle] = useState("");
    const [type,setType] = useState("expense");
    const [amount,setAmount] = useState(0.00);
    const [date,setDate] = useState(DEFAULT_DATE);
    const [recurrenceRate,setRecurrenceRate] = useState(recurrenceRates.NONE);
    // const [billingDate,setBillingDate] = useState(DEFAULT_DATE);
    // const [dueDate,setDueDate] = useState(DEFAULT_DATE);

    const onOpen = () => {
        if (transaction) {
            setId(transaction.id);
            setTitle(transaction.title);
            setAmount(transaction.amount);
            setDate(transaction.date);
            setRecurrenceRate(transaction.recurrenceRate);
        } else {
            setTitle('');
            setAmount('');
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
        // onAddOrUpdate({
        //     id: uuid,
        //     type: TRANSACTION_TYPE,
        //     title: title,
        //     amount: amount,
        //     date: date,
        //     recurrenceRate: recurrenceRate
        // });
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
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" placeholder="Enter Title Here" value={ title } onChange={(event) => setTitle(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control name="amount" type="number" min={0.01} step="0.01" placeholder="Income Amount" value={ amount } onChange={onAmountChanged} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Payment Date</Form.Label>
                            <Form.Control name="date" type="date" value={getDateString(date)} onChange={(event) => setDate(new Date(`${event.target.value}T07:00:00.000Z`)) } />
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

const getDateString = (date) => {
    const yyyy = date.getFullYear();

    let MM = `${date.getMonth() + 1}`;
    if (MM.length < 2) {
        MM = '0' + MM;
    }

    let dd = `${date.getDate()}`;
    if (dd.length < 2) {
        dd = '0' + dd;
    }

    return `${yyyy}-${MM}-${dd}`;
}

export default TransactionEditor;