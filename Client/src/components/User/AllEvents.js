import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 160px; // Adjust this value as needed
`;

function AllEvents() {
    const navigate = useNavigate(); // פונקציה של רייאקט דום להעברת מידע בזמן מעבר לעמוד אחר

    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    useEffect(() => {
        const token = localStorage.getItem('jwt-token');
        function checkLogin() {
            if (!token)
                navigate("/login");
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
        checkLogin(); //Call the Login Check function
        fetchData();
    }, []); // Empty array means this effect runs once on mount


    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <div>
                    <p>[STATUS] {status}</p>
                    <p>[MESSAGE] {message}</p>
                    <p>[JSON] {JSON.stringify(data)}</p>
                    {data ? data.map((item, index) => (
                        <form>
                            <table style={{ width: '100%' }}>
                                <tr>
                                    <td style={{ width: "100px" }}>Index: {index}</td>
                                    <td style={{ width: "100px" }}>ID: {item._id}</td>
                                    <td style={{ width: "100px" }}>UserID: {item.userID}</td>
                                    <td style={{ width: "100px" }}>Name: {item.name}</td>
                                    <td style={{ width: "100px" }}>Date: {item.date}</td>
                                    <td style={{ width: "100px" }}>Location: {item.location}</td>
                                    <td style={{ width: "100px" }}>Type: {item.type}</td>
                                    <td style={{ width: "100px" }}>notes: {item.notes}</td>
                                </tr>
                            </table>
                        </form>
                    )) : <p>Loading...</p>
                    }
                </div>
            </MainContent>
        </div >
    );

}

export default AllEvents;