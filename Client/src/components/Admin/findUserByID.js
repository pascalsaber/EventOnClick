import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function FindUserByID() {
    const token = localStorage.getItem('jwt-token');
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
            setData(null);
            const fetchResponse = await fetch(`http://localhost:5000/user/findUserByID?id=${inputs.id}`, { // לאיזה כתובת לפנות 
                method: "GET", // שיטה הפניה 
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`// שיטת ההצפנה 
                }
            });
            setStatus(`${fetchResponse.status}`);
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(responseText);
                throw new Error(`[Error] Status: ${fetchResponse.status} Response: ${responseText}`);
            }
            const dataJSON = await fetchResponse.json();
            setMessage("Success");
            setData(dataJSON);
        } catch (error) {
            console.error(error);
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