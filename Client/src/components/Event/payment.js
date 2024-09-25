import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import { useNavigate } from 'react-router-dom';
import { checkLogin, fetch_URL_GET, fetch_URL_POST } from '../utils';
import styled from 'styled-components';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function Payment() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    const [inputs, setInputs] = useState({}); //עבור התיבות טקסט
    const [data, setData] = useState(null); //  מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); // עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); // עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    //window.location.search - (?eventID=abc&name=bbb לדוגמה )מכילה את החלק שאני שולחת בניתוב במקרה שלי אני יקבל 
    // URLSearchParams - הצבת הערך שמתקבל בבנאי זה על מנת לשלוף ולעדכין מאת המידע בצורה מסודרת 
    const queryParameters = new URLSearchParams(window.location.search)
    // שליפת הערך של איבנת אי די ושמירתו במשתנה 
    const query_eventid = queryParameters.get("eventid")

    // הפונקציה הזו נועדה להביא נתונים על אירוע מסוים מהשרת ולעדכן את המצב בהתאם
    async function fetchData(eventID) {
        try {
            const fetchData = await fetch_URL_GET(`http://localhost:5000/event/findOneEvent?eventID=${eventID}`, token);
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);

            let totalPrice = 0;
            fetchData.data.meals.forEach((item) => {
                if (item != null)
                    totalPrice += item.price;
            });
            fetchData.data.decorations.forEach((item) => {
                if (item != null)
                    totalPrice += item.price;
            });
            setInputs(values => ({ ...values, ["totalCost"]: totalPrice }))
        } catch (error) {
            console.error(`[Error] ${error}`);
        }
    }

    useEffect(() => {
        fetchData(query_eventid)
    }, []); //  משתנה products אפקט זה פועל בכל פעם ש 

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד

        try {
           //if (inputs.totalCost <= 0)
            //    return setMessage("חובה לעדכן את הטפרית הארוחות ועיצוב, לא ניתן לסגור אירוע בסכום של 0 שקלים.")
            // מידע להעברה
            let tempData = {
                eventID: query_eventid,
                data: JSON.stringify({ status: "Closed", payments: inputs }),
            };
            // פניה לשרת
            const fetchData = await fetch_URL_POST("http://localhost:5000/event/updatePayment", token, tempData);
            // הצוות נתונים במשתנים
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);
        } catch (error) {
            console.error(`[Error] ${error}`);
        }
    }
    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <br></br>
                <form class="form" onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-1">
                        <Form.Label column sm="2">Card Holder Name</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                size="sm"
                                placeholder="Enter your Card Holder Name"
                                type="text"
                                name="cardHolderName"
                                value={inputs.cardHolderName || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">Card Number</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                size="sm"
                                placeholder="Enter your Card Number"
                                type="text"
                                name="cardNumber"
                                value={inputs.cardNumber || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">Card Holder ID</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                size="sm"
                                placeholder="Enter your Card Holder ID"
                                type="text"
                                name="cardHolderID"
                                value={inputs.cardHolderID || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">Expiry Date</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                size="sm"
                                placeholder="Enter your Expiry Date"
                                type="date"
                                name="expiryDate"
                                value={inputs.expiryDate || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">Security Code</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                min="100"
                                max="999"
                                size="sm"
                                placeholder="Enter your Security Code"
                                type="number"
                                name="securityCode"
                                value={inputs.securityCode || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">Total Cost</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                disabled
                                required
                                min="1"
                                size="sm"
                                placeholder="Total Cost"
                                type="text"
                                name="totalCost"
                                value={inputs.totalCost || ""} />
                        </Col>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        {Object(data).status === "Open" ?
                            <Button variant="primary" size="lg" type="submit">Payment</Button>
                            : (<Alert variant="danger" className="text-center">אירוע זה סגור.</Alert>)
                        }
                        <p>[MESSAGE] {message}</p>
                        {process.env.REACT_APP_TESTING === 'TRUE' ?
                            <>
                                <h5>Testing Mode</h5>
                                <p>[STATUS] {status}</p>
                                <p>[JSON] {JSON.stringify(data)}</p>
                            </> : null
                        }
                    </div>
                </form>
            </MainContent>
        </div>
    );
}

export default Payment;