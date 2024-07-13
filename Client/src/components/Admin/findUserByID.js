import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function FindUserByID() {
    const [data, setData] = useState(null);
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }
        
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:5000/user/findUserByID?id=${inputs.id}`)
            .then(response => response.json())
            .then(data => setData([data]))
            .catch(err => console.error(err));
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
                <div>
                    <p>JSON stringify</p>
                    {JSON.stringify(data)}
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

export default FindUserByID;