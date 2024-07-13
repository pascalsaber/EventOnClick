import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function Profile() {
    const [data, setData] = useState(null);
    const [inputs, setInputs] = useState({});
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {

        } catch (error) {
            console.error(`[HandleSubmit Error] ${error}`);
        }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

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

                setInputs(values => ({ ...values, ['username']: dataJSON.data.username }))
                setInputs(values => ({ ...values, ["firstName"]: dataJSON.data.firstName }))
                setInputs(values => ({ ...values, ["lastName"]: dataJSON.data.lastName }))
                setInputs(values => ({ ...values, ["email"]: dataJSON.data.email }))
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
                <br></br>
                <form class="form" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={inputs.username || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={inputs.firstName || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={inputs.lastName || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={inputs.email || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <input type="submit" value="Update" />
                    <div>
                        <p>[STATUS] {status}</p>
                        <p>[MESSAGE] {message}</p>
                        <p>[JSON] {JSON.stringify(data) /*TEMP*/}</p>
                    </div>
                </form>
                {/*data ? data.map((item, index) => (
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
                */}
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

