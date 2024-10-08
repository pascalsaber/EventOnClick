import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { checkLogin, fetch_URL_GET, fetch_URL_POST } from '../utils';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function AllEvents() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    async function DeleteEvent(eventID) {
        try {
            const fetchData = await fetch_URL_GET(`http://localhost:5000/event/deleteEvent?eventID=${eventID}`, token);
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);
            window.location.reload();
        } catch (error) {
            console.error(`[Error] ${error}`);
        }
    }

    async function fetchData() {
        try {
            const fetchData = await fetch_URL_GET("http://localhost:5000/event/allEvents", token);
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);
        } catch (error) {
            console.error(`[Error] ${error}`);
        }
    }

    useEffect(() => {
        fetchData();
    }, []); // Empty array means this effect runs once on mount

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <br></br>
                <Container className="form" fluid>
                    <Row>
                        <Col>
                            <Table striped bordered hover size="sm" responsive="sm">
                                <thead>
                                    <tr>
                                        <th>Edit</th>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Type</th>
                                        <th>Notes</th>
                                        <th>Status</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data ? data.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => navigate(`/addEvent?eventid=${item._id}`)}
                                                >
                                                    Edit
                                                </Button>
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.date}</td>
                                            <td>{item.location}</td>
                                            <td>{item.type}</td>
                                            <td>{item.notes}</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => DeleteEvent(item._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan="8">Loading...</td></tr>}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>[MESSAGE] {message}</p>
                            {process.env.REACT_APP_TESTING === 'TRUE' && (
                                <>
                                    <h5>Testing Mode</h5>
                                    <p>[STATUS] {status}</p>
                                    <p>[JSON] {JSON.stringify(data)}</p>
                                </>
                            )}
                        </Col>
                    </Row>
                </Container>
            </MainContent >
        </div >
    );
}

export default AllEvents;