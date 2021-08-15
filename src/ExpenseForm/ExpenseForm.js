import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ExpenseForm = () => {
    const [show,setShow] = useState(false);
    const onOpen = () => {
        setShow(true);
    }
    const onClose = () => {
        setShow(false);
    }
    return (
        <>
            <button type="button" className="btn btn-primary btn-sm" onClick={ onOpen }>Add Expense</button>
            <Modal show={ show } onHide={ onClose }>
                <Modal.Header closeButton>
                    <Modal.Title>Expense Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ onClose }>Close</Button>
                </Modal.Footer>
            </Modal>            
        </>
    );
}

export default ExpenseForm;