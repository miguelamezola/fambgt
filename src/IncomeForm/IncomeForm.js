import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { v4 as uuidv4 } from 'uuid';

const IncomeForm = ({onAddOrUpdate, data}) => {
    const TRANSACTION_TYPE = "income";
    const [show,setShow] = useState(false);

    const [id,setId] = useState("");
    const [title,setTitle] = useState("");
    const [amount,setAmount] = useState(0.00);
    const [date,setDate] = useState(new Date());
    const [recurrenceRate,setRecurrenceRate] = useState("None");

    const onOpen = () => {
        if (data) {
            setId(data.id);
            setTitle(data.title);
            setAmount(data.amount);
            setDate(data.date);
            setRecurrenceRate(data.recurrenceRate);
        } else {
            setTitle("");
            setAmount(0.00);
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
        onAddOrUpdate({
            id: uuid,
            type: TRANSACTION_TYPE,
            title: title,
            amount: amount,
            date: date,
            recurrenceRate: recurrenceRate
        });
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
    const isDirty = () => !data || data.id !== id || data.title !== title || data.amount !== amount || data.date !== date || data.recurrenceRate !== recurrenceRate;

    return (
        <>
            <button type="button" className="btn btn-secondary btn-sm" onClick={ onOpen }>Add Income</button>
            <Modal show={ show } onHide={ onClose } centered>
                <Modal.Header closeButton>
                    <Modal.Title>Income Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" placeholder="Enter Title Here" value={ title } onChange={(event) => setTitle(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control name="amount" type="number" min={0} step="0.01" placeholder="Income Amount" value={ amount } onChange={onAmountChanged} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control name="date" type="date" value={getDateString(date)} onChange={(event) => setDate(new Date(`${event.target.value}T07:00:00.000Z`)) } />
                        </Form.Group>                        
                        <Form.Group>
                            <Form.Label>Recurrence Rate</Form.Label>
                            <Form.Select name="recurrenceRate" value={recurrenceRate} onChange={(event) => setRecurrenceRate(event.target.value)}>
                                <option>None</option>                                
                                <option>2 weeks</option>
                                <option>1 month</option>
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

export default IncomeForm;