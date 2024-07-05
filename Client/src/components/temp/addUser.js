import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
  margin-left: 160px; // Adjust this value as needed
`;

function AddUser() {
    const [data, setData] = useState(null);
    const [inputs, setInputs] = useState({});
    const [status, setStatus] = useState("");
    const [response, setResponse] = useState("");

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

    const handleSubmit = async (event) => {

        event.preventDefault();
        /*
        fetch(`http://localhost:5000/user/add?username=${inputs.username}&password=${inputs.password}&email=${inputs.email}&age=${inputs.age}&firstName=${inputs.firstName}&lastName=${inputs.lastName}`)
            .then(response => response.json())
            .then(data => setData([data]))
            .catch(err => console.error(err));*/
        try {
            const response = await fetch(`http://localhost:5000/user/add?username=${inputs.username}&password=${inputs.password}&email=${inputs.email}&age=${inputs.age}&firstName=${inputs.firstName}&lastName=${inputs.lastName}`);
            const result = await response.json();
            setData([result]);
            setStatus(`${response.status}`);
            setResponse(`Success`);
            console.log("Success:", result);
        } catch (error) {
            setStatus(`500`);
            setResponse(`[Error] ${error.message}`);
            console.error("Error:", error);
        }
    }

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <div>Enter your username:
                        <input
                            type="text"
                            name="username"
                            value={inputs.username || ""}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <div>Enter your password:
                        <input
                            type="password"
                            name="password"
                            value={inputs.password || ""}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <div>Enter your email:
                        <input
                            type="text"
                            name="email"
                            value={inputs.email || ""}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <div>Enter your age:
                        <input
                            type="number"
                            name="age"
                            value={inputs.age || ""}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <div>Enter your firstName:
                        <input
                            type="text"
                            name="firstName"
                            value={inputs.firstName || ""}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <div>Enter your lastName:
                        <input
                            type="text"
                            name="lastName"
                            value={inputs.lastName || ""}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <input style={{ height: "25px", width: "150px", marginTop: '10px' }} type="submit" value="Login" />
                </form>
                <div>
                    <p>[STATUS] {status}</p>
                    <p>[RESPONSE] {response}</p>
                    <p>[JSON] {JSON.stringify(data)}</p>

                </div>

                {/*data !== null && data.map((item, index) => (
                    item.name === inputs.name ? <div style={{ color: 'green' }}>Found user with this name!</div> : <div style={{ color: 'red' }}>Not the user!</div>
                ))*/}
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
                                <td style={{ width: "100px" }}>Age: {item.age}</td>
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

export default AddUser;