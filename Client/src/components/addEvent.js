import React, { useEffect, useState } from 'react';
import Menu from './menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 160px; // Adjust this value as needed
`;

function AddEvent() {
    const [inputs, setInputs] = useState({}); //עבור התיבות טקסט
    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    let [enumLocationList, setEnumLocationList] = useState([{ value: "", label: "Error Loading from Database..." }])
    let [enumTypeList, setEnumTypeList] = useState([{ value: "", label: "Error Loading from Database..." }])


    useEffect(() => {
        async function fetch_enum(enumRequest) {
            const fetchResponse = await fetch(`http://localhost:5000/event/enumRequest?enumRequest=${enumRequest}`);
            if (fetchResponse.ok) {
                let responseJSON = await fetchResponse.json();
                let list = [{ value: "", label: "Select..." }];
                responseJSON.map((item) => {
                    list.push({
                        value: item,
                        label: item
                    });
                });
                if (enumRequest == "location")
                    setEnumLocationList(list);
                else if (enumRequest == "type")
                    setEnumTypeList(list);
            }
        }

        fetch_enum("location");
        fetch_enum("type");
    }, []); // Empty array means this effect runs once on mount

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); //לא לבצע רענון לעמוד
        try {
            const response = await fetch("http://localhost:5000/event/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: inputs.name,
                    date: inputs.date,
                    location: inputs.location,
                    type: inputs.type,
                    notes: inputs.notes
                })
            });

            setData(null);
            setStatus(`${response.status}`);
            if (!response.ok) {
                let message = await response.text();
                setMessage(message);
                throw new Error(`[Error] Status: ${response.status} Message: ${message}`);
            }

            const dataJSON = await response.json();
            setMessage("Success");
            setData([dataJSON]);
        } catch (error) {
            console.error(`[HandleSubmit Error] ${error}`);
        }
    }

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <form class="form" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={inputs.name || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={inputs.date || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <label>Location</label>
                    <select name="location" value={inputs.location} onChange={handleChange} style={{ marginLeft: '10px' }}>
                        {enumLocationList.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <label>Type</label>
                    <select name="type" value={inputs.type} onChange={handleChange} style={{ marginLeft: '10px' }}>
                        {enumTypeList.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <label>Notes</label>
                    <input
                        type="text"
                        name="notes"
                        value={inputs.notes || ""}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                    <input type="submit" value="Login" />
                    <div>
                        <p>[STATUS] {status}</p>
                        <p>[MESSAGE] {message}</p>
                        <p>[JSON] {JSON.stringify(data)}</p>
                        <p>{JSON.stringify(enumLocationList)}</p>
                    </div>
                </form>

                {/*data !== null && data.map((item, index) => (
                    item.name === inputs.name ? <div style={{ color: 'green' }}>Found user with this name!</div> : <div style={{ color: 'red' }}>Not the user!</div>
                ))*/}
                {data ? data.map((item, index) => (
                    <form>
                        <table style={{ width: '100%' }}>
                            <tr>
                                <td style={{ width: "100px" }} >Index: {index}</td>
                                <td style={{ width: "100px" }} >ID: {item._id}</td>
                                <td style={{ width: "100px" }}>event_name: {item.event_name}</td>
                                <td style={{ width: "100px" }}>event_location: {item.event_location}</td>
                                <td style={{ width: "100px" }}>type: {item.type}</td>
                                <td style={{ width: "100px" }}>Notes: {item.Notes}</td>
                            </tr>
                        </table>
                    </form>
                )) : <p>Loading...</p>
                }
            </MainContent>
        </div>
    );
}

// Example 
/* const Select = ({ label, value, options, onChange }) => {
    return (
        <label>
            <select style={{ marginLeft: '10px' }} value={value} onChange={onChange}>
                {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};*/

export default AddEvent;