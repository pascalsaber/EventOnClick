import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { checkLogin, fetch_URL_GET, fetch_URL_POST } from '../utils';
import Form from 'react-bootstrap/Form'; //https://react-bootstrap.netlify.app/docs/forms/form-control
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function Login() {
    const [inputs, setInputs] = useState({}); //עבור התיבות טקסט
    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    const navigate = useNavigate(); // פונקציה של רייאקט דום להעברת מידע בזמן מעבר לעמוד אחר   

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {
            // מידע להעברה
            let tempData = {
                username: inputs.username,
                password: inputs.password
            };
            // פניה לשרת
            const fetchData = await fetch_URL_POST("http://localhost:5000/user/login", null, tempData);
            // הצוות נתונים במשתנים
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);

            localStorage.setItem("jwt-token", fetchData.data.token);
            navigate("/allEvents");
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
                                placeholder="Enter your Username"
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
                                placeholder="Enter your Password"
                                type="text"
                                name="password"
                                value={inputs.password || ""}
                                onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" type="submit">Login</Button>
                        <p>[STATUS] {status}</p>
                        <p>[MESSAGE] {message}</p>
                        <p>[JSON] {JSON.stringify(data) /*TEMP*/}</p>
                    </div>
                </form>
            </MainContent>
        </div >
    );
}

export default Login;