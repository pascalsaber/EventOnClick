import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import { useNavigate } from 'react-router-dom';
import { checkLogin, fetch_URL_GET } from '../utils';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form'; //https://react-bootstrap.netlify.app/docs/forms/form-control
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function Payment () {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    const [inputs, setInputs] = useState({}); //עבור התיבות טקסט
    const [data, setData] = useState(null); // מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); // עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); // עבור הודעה שיצרנו שמתקבלת בפניה לשרת
/*
    const initialFormData = {
        cardHolderName: '',
        cardNumber: '',
        cardHolderID: '',
        expiryDate: '',
        securityCode: '',
        totalCost: ''
    }
    const [formData, setFormData] = useState(initialFormData); // עבור התיבות בחירה*/

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
            fetchData.data.meals.forEach((item, index) => {
                if (item != null) {
                    //console.log("Index: " + index + " Meal: " + JSON.stringify(item))
                    totalPrice += item.price;
                }
            });
            fetchData.data.decorations.forEach((item, index) => {
                if (item != null) {
                    //console.log("Index: " + index + " Decoration: " + JSON.stringify(item))
                    totalPrice += item.price;
                }
            });
            console.log("Total Price: " + totalPrice)
            setInputs(values => ({ ...values, ["totalCost"]: totalPrice })) 
        } catch (error) {
            console.error(error);
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
            const fetchResponse = await fetch("http://localhost:5000/event/updatePayment", { // לאיזה כתובת לפנות 
                method: "POST", // שיטה הפניה
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`// שיטת ההצפנה 
                },
                body: JSON.stringify(
                    { // המרת המידעה שנשלח כבדי מהטופס לאקספרס
                        // האינפוט הוא המידעה שנרשם בטופס
                        eventID: query_eventid,
                        data: JSON.stringify({ payments : inputs }),
                    })
            });
            console.log("Inputs: "+ JSON.stringify(inputs))
            setData(null);
            setStatus(`${fetchResponse.status}`);
            //ok אם הסטטוס שונה מ200 שהוא
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(responseText);
                throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
            }
            const dataJSON = await fetchResponse.json();
            
            setMessage("Success");
            setData([dataJSON]);
            //fetchData(query_eventid);
            //navigate(`/selectADecoration?eventid=${dataJSON._id}`);
        } catch (error) {
            console.error(`[HandleSubmit Error] ${error}`);
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
                        <Form.Label column sm="2">card Number</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                size="sm"
                                placeholder="Enter your cardNumber"
                                type="text"
                                name="cardNumber"
                                value={inputs.cardNumber || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">card Holder ID</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                size="sm"
                                placeholder="Enter your cardHolderID"
                                type="text"
                                name="cardHolderID"
                                value={inputs.cardHolderID || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">expiry Date</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                size="sm"
                                placeholder="Enter your expiryDate"
                                type="date"
                                name="expiryDate"
                                value={inputs.expiryDate || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">security Code</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                size="sm"
                                placeholder="Enter your securityCode"
                                type="number"
                                name="securityCode"
                                value={inputs.securityCode || ""}
                                onChange={handleChange} />
                        </Col>
                        <Form.Label column sm="2">totalCost</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                disabled
                                required
                                size="sm"
                                placeholder="Enter your totalCost"
                                type="text"
                                name="totalCost"
                                value={inputs.totalCost || ""} />
                        </Col>
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" type="submit">Payment</Button>
                        <p>[STATUS] {status}</p>
                        <p>[MESSAGE] {message}</p>
                        <p>[JSON] {JSON.stringify(data) /*TEMP*/}</p>
                    </div>
                </form>
            </MainContent>
        </div>
    );
}

export default Payment;