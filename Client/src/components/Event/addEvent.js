import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { checkLogin } from '../utils';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function AddEvent() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    //window.location.search - (?eventID=abc&name=bbb לדוגמה )מכילה את החלק שאני שולחת בניתוב במקרה שלי אני יקבל 
    // URLSearchParams - הצבת הערך שמתקבל בבנאי זה על מנת לשלוף ולעדכין מאת המידע בצורה מסודרת 
    const queryParameters = new URLSearchParams(window.location.search)
    // שליפת הערך של איבנת אי די ושמירתו במשתנה 
    //let query_eventid = queryParameters.get("eventid")
    const [query_eventid, setquery_eventid] = useState(queryParameters.get("eventid"))

    const [inputs, setInputs] = useState({}); //עבור התיבות טקסט
    const [data, setData] = useState(null); //מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); //עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); //עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    const [enumLocationList, setEnumLocationList] = useState([{ value: "", label: "Error Loading from Database..." }])
    const [enumTypeList, setEnumTypeList] = useState([{ value: "", label: "Error Loading from Database..." }])

    useEffect(() => {
        async function fetchEventByID() {
            try {
                //eventID לשרת עם get שולח בקשת 
                const fetchResponse = await fetch(`http://localhost:5000/event/findOneEvent?eventID=${query_eventid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });
                // מעדכן את הסטטוס של הבקשה
                setStatus(`${fetchResponse.status}`);
                // בודק אם הבקשה לא הצליחה
                if (!fetchResponse.ok) {
                    let responseText = await fetchResponse.text();
                    setMessage(responseText);
                    throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
                }
                //JSON -ממיר את התגובה ל
                const dataJSON = await fetchResponse.json();
                setMessage("Success");
                setData(dataJSON);
                setInputs(dataJSON);
            } catch (error) {
                console.error(error);
            }
        }
        if (query_eventid)
            fetchEventByID();
    }, [enumTypeList]);

    useEffect(() => {
        async function fetch_enum(type) {
            const fetchResponse = await fetch(`http://localhost:5000/event/returnEnumListByType?type=${type}`);
            if (fetchResponse.ok) {
                let responseJSON = await fetchResponse.json();
                let list = [{ value: "", label: "Select..." }];
                responseJSON.map((item) => {
                    list.push({
                        value: item,
                        label: item
                    });
                });
                if (type == "location")
                    setEnumLocationList(list);
                else if (type == "type")
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
        let URL = "http://localhost:5000/event/add";
        if (query_eventid)
            URL = `http://localhost:5000/event/updateEventByID?eventid=${query_eventid}`;
        try {
            const fetchResponse = await fetch(URL, { // לאיזה כתובת לפנות 
                method: "POST", // שיטה הפניה 
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`// שיטת ההצפנה 
                },
                body: JSON.stringify({ // המרת המידעה שנשלח כבדי מהטופס לאקספרס
                    // האינפוט הוא המידעה שנרשם בטופס
                    name: inputs.name,
                    date: inputs.date,
                    location: inputs.location,
                    type: inputs.type,
                    notes: inputs.notes,
                    status: "Open" //Closed
                })
            });

            setData(null);
            setStatus(`${fetchResponse.status}`);
            //ok אם הסטטוס שונה מ200 שהוא
            if (!fetchResponse.ok) {
                let responseText = await fetchResponse.text();
                setMessage(responseText);
                throw new Error(`[Error] Status: ${fetchResponse.status} Message: ${responseText}`);
            }
            // מכיל את המידע שחוזר מהאקספרס שהוא בעצם האירוע החדש שיצרנו
            const dataJSON = await fetchResponse.json();
            setMessage("Success");
            setData([dataJSON]);
            setquery_eventid(dataJSON._id)
            //פונקציה זו מעבירה לניתוב הבא במקרה שלנו לשלב שני שהוא יצירת תפריט לאירוע
        } catch (error) {
            console.error(`[HandleSubmit Error] ${error}`);
        }
    }

    return (
        <div>
            <Menu /> {/* Here's your Menu component */}
            <MainContent>
                <br></br>
                <form class="form" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <label>Name</label>
                    <input
                        required
                        type="text"
                        name="name"
                        value={inputs.name || ""}
                        onChange={handleChange}
                    />
                    <label>Date</label>
                    <input
                        required
                        type="date"
                        name="date"
                        value={inputs.date || ""}
                        onChange={handleChange}
                    />
                    <label>Location</label>
                    <select name="location" value={inputs.location} onChange={handleChange} required>
                        {enumLocationList.map((item) => (
                            <option value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    <label>Type</label>
                    <select name="type" value={inputs.type} onChange={handleChange} required>
                        {enumTypeList.map((item) => (
                            <option value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    <label>Notes</label>
                    <input
                        required
                        type="text"
                        name="notes"
                        value={inputs.notes || ""}
                        onChange={handleChange}
                    />
                    <input type="submit" value="Update" />
                    {query_eventid ?
                        <Button variant="primary" size="lg" onClick={() => navigate(`/selectAMeal?eventid=${query_eventid}`)} >Next Page</Button>
                        : <></>
                    }
                    <p>[MESSAGE] {message}</p>
                    {process.env.REACT_APP_TESTING === 'TRUE' ?
                        <>
                            <h5>Testing Mode</h5>
                            <p>[STATUS] {status}</p>
                            <p>[JSON] {JSON.stringify(data)}</p>
                        </> : null
                    }
                </form>
            </MainContent>
        </div>
    );
}

export default AddEvent;