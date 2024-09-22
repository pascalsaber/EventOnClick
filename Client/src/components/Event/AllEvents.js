import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function AllEvents() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של רייאקט דום להעברת מידע בזמן מעבר לעמוד אחר

    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    async function DeleteEvent(eventID) {
        try {
            const fetchResponse = await fetch(`http://localhost:5000/event/deleteEvent?eventID=${eventID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });
            setStatus(`${fetchResponse.status}`);
            let responseText = await fetchResponse.text();
            setMessage(responseText);
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchData() {
        try {
            const fetchResponse = await fetch("http://localhost:5000/event/allEvents", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });
            setStatus(`${fetchResponse.status}`);
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(responseText);
                throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
            }
            const dataJSON = await fetchResponse.json();
            setMessage("Success"); //TEMP
            setData(dataJSON);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('jwt-token');
        function checkLogin() {
            if (!token)
                navigate("/login");
        }
        checkLogin(); //Call the Login Check function
        fetchData();
    }, []); // Empty array means this effect runs once on mount


    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <br></br>
                <div class="form">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Edit</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Notes</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        {data ? data.map((item, index) => (
                            <tbody>
                                <tr>
                                    <td><button style={{ width: "50px" }} onClick={() => navigate(`/SelectAMeal?eventid=${item._id}`)}>Edit</button></td>
                                    <td>{item.name}</td>
                                    <td>{item.date}</td>
                                    <td>{item.location}</td>
                                    <td>{item.type}</td>
                                    <td>{item.notes}</td>
                                    <td><button style={{ width: "50px" }} onClick={() => DeleteEvent(item._id)}>Delete</button></td>
                                </tr>
                            </tbody>
                        )) : <p>Loading...</p>
                        }
                    </Table>
                    <p>[MESSAGE] {message}</p>
                    {process.env.REACT_APP_TESTING === 'TRUE' ?
                        <>
                            <h5>Testing Mode</h5>
                            <p>[STATUS] {status}</p>
                            <p>[JSON] {JSON.stringify(data)}</p>
                        </> : null
                    }
                </div>
            </MainContent >
        </div >
    );
}

export default AllEvents;