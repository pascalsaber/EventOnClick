import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { checkLogin, fetch_URL_GET } from '../utils';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function FindUserByID() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    const [data, setData] = useState(null);
    const [inputs, setInputs] = useState({});
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const fetchData = await fetch_URL_GET(`http://localhost:5000/user/findUserByID?id=${inputs.id}`, token);
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
                <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <div>Enter your id:
                        <input
                            type="text"
                            name="id"
                            value={inputs.id || ""}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <input style={{ height: "25px", width: "150px", marginTop: '10px' }} type="submit" value="Login" />
                </form>
                <p>[MESSAGE] {message}</p>
                {process.env.REACT_APP_TESTING === 'TRUE' ?
                    <>
                        <h5>Testing Mode</h5>
                        <p>[STATUS] {status}</p>
                        <p>[JSON] {JSON.stringify(data)}</p>
                    </> : null
                }
            </MainContent>
        </div>
    );
}

export default FindUserByID;