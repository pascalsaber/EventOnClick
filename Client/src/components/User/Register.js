import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import { checkLogin, fetch_URL_GET, fetch_URL_POST } from '../utils';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form'; //https://react-bootstrap.netlify.app/docs/forms/form-control
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function Register() {
    const navigate = useNavigate(); // פונקציה של רייאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    const [inputs, setInputs] = useState({}); //עבור התיבות טקסט
    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {
            if (inputs.password != inputs.retypePassword) //בדיקה שהסיסמא זהה בשתי השדות
                return setMessage("Password do not match.");

            // מידע להעברה
            let tempData = {
                username: inputs.username,
                password: inputs.password,
                firstName: inputs.firstName,
                lastName: inputs.lastName,
                age: inputs.age,
                email: inputs.email,
                status: 0 //ברירת מחדש משתמש רגיל
            };
            // פניה לשרת
            const fetchData = await fetch_URL_POST("http://localhost:5000/user/register", null, tempData);
            // הצוות נתונים במשתנים
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);

            setMessage("ההרשמה בוצעה בהצלה, בעוד 10 שניות תועבר לעמוד ההתחברות.");
            setTimeout(() => {
                navigate("/login");
            }, 10000);
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
                        <Form.Label column sm="2">Username</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                size="sm"
                                placeholder=""
                                type="text"
                                name="username"
                                value={inputs.username || ""}
                                onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1">
                        <Form.Label column sm="2">Password</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                size="sm"
                                placeholder=""
                                type="password"
                                name="password"
                                value={inputs.password || ""}
                                onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1">
                        <Form.Label column sm="2">Retype Password</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                size="sm"
                                placeholder=""
                                type="password"
                                name="retypePassword"
                                value={inputs.retypePassword || ""}
                                onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1">
                        <Form.Label column sm="2">First Name</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                size="sm"
                                placeholder=""
                                type="text"
                                name="firstName"
                                value={inputs.firstName || ""}
                                onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1">
                        <Form.Label column sm="2">Last Name</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                size="sm"
                                placeholder=""
                                type="text"
                                name="lastName"
                                value={inputs.lastName || ""}
                                onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1">
                        <Form.Label column sm="2">Age</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                size="sm"
                                placeholder=""
                                type="number"
                                name="age"
                                value={inputs.age || ""}
                                onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1">
                        <Form.Label column sm="2">Email</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                size="sm"
                                placeholder=""
                                type="text"
                                name="email"
                                value={inputs.email || ""}
                                onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" type="submit">Register</Button>
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
        </div >
    );
}

export default Register;