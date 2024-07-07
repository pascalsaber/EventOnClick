import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 160px; // Adjust this value as needed
`;

function Profile() {
    const [data, setData] = useState(null);
    const [inputs, setInputs] = useState({});
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('jwt-token');

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append('Authorization', `Bearer ${token}`);

                const fetchResponse = await fetch("http://localhost:5000/user/profile", {
                    method: "GET",
                    headers: myHeaders
                });

                setStatus(`${fetchResponse.status}`);
                if (!fetchResponse.ok) {
                    let responseText = await fetchResponse.text();
                    setMessage(responseText);
                    throw new Error(`[Error] Status: ${fetchResponse.status} Response: ${responseText}`);
                }

                const dataJSON = await fetchResponse.json();
                setMessage("Success");
                setData([dataJSON]);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();

    }, []); // Empty array means this effect runs once on mount


    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <div>
                    <p>[STATUS] {status}</p>
                    <p>[RESPONSE] {message}</p>
                    <p>[JSON] {JSON.stringify(data)}</p>
                </div>        
                {data ? data.map((item, index) => (
                    <form>
                        <table style={{ width: '100%' }}>
                            <tr>
                                <td style={{ width: "100px" }} >Index: {index}</td>
                                <td style={{ width: "100px" }} >ID: {item._id}</td>
                                <td style={{ width: "100px" }}>Username: {item.username}</td>
                                <td style={{ width: "100px" }}>Password: {item.password}</td>
                                <td style={{ width: "100px" }}>First Name: {item.firstName}</td>
                                <td style={{ width: "100px" }}>Last Name: {item.lastName}</td>
                                <td style={{ width: "100px" }}>Email: {item.email}</td>
                            </tr>
                        </table>
                    </form>
                )) : <p>Loading...</p>
                }
            </MainContent>
        </div>
    );
}

export default Profile;
/*
export function TestLogin() {
    //const { decodedToken, isExpired } = useJwt(token);
    // src/components/Profile.js
    const token = localStorage.getItem('token');
    fetch('/api/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((userData) => {
            // Use user data
        })
        .catch((error) => {
            // Handle unauthorized access
        });
    return (
        <div>Decoded Token: {decodedToken}</div>
    );
};*/

