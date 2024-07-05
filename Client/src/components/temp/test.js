import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
  margin-left: 160px; // Adjust this value as needed
`;

function Test() {
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
            const response = await fetch(`http://localhost:5000/user/test?test=${inputs.test}`);
            console.log(`[FETCH] http://localhost:5000/user/test?test=${inputs.test}`)
            const result = await response.text();
            setData(result);
            setStatus(`${response.status}`);
            setResponse(`Success`);
            console.log("[Success Message] ", result);
        } catch (error) {
            setStatus(`Failed`);
            setResponse(`[Error] ${error.message}`);
            console.error("[Error Message] ", error);
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
                            name="test"
                            value={inputs.test || ""}
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

            </MainContent>
        </div>
    );
}

export default Test;