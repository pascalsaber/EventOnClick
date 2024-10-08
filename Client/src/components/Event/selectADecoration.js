import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { checkLogin, fetch_URL_GET, fetch_URL_POST } from '../utils';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function SelectADecoration() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   
    checkLogin(navigate, token); // בדיקה שהמשתמש מחובר והתוקן תקין

    const [data, setData] = useState(null); // מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); // עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); // עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    const initialFormData = {};
    for (let i = 1; i <= 2; i++) {
        initialFormData[`option${i}`] = {
            table: '',
            map: '',
            extra1: '',
            extra2: '',
            amount: '',
            price: ''
        };
    }
    const [formData, setFormData] = useState(initialFormData); // עבור התיבות בחירה
    // מכיל את כל המידע של המוצרים
    const [products, setProducts] = useState([])

    //window.location.search - (?eventID=abc&name=bbb לדוגמה )מכילה את החלק שאני שולחת בניתוב במקרה שלי אני יקבל 
    // URLSearchParams - הצבת הערך שמתקבל בבנאי זה על מנת לשלוף ולעדכין מאת המידע בצורה מסודרת 
    const queryParameters = new URLSearchParams(window.location.search)
    // שליפת הערך של איבנת אי די ושמירתו במשתנה 
    const query_eventid = queryParameters.get("eventid")

    // מטרת הפונקציה זה להחזיר את המוצרים עם כל הפרטים על כל מוצר לפי קטגוריה 
    async function fetch_findProductByCategory(category) {
        try {
            // פניה לשרת
            const fetchData = await fetch_URL_GET(`http://localhost:5000/product/findProductByCategory`, token);
            // הצוות נתונים במשתנים
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setProducts(fetchData.data)
        } catch (error) {
            console.error(`[Error] ${error}`);
        }
    }
    // הפונקציה הזו נועדה להביא נתונים על אירוע מסוים מהשרת ולעדכן את המצב בהתאם
    async function fetchData(eventID) {
        try {
            //eventID לשרת עם get שולח בקשת 
            const fetchData = await fetch_URL_GET(`http://localhost:5000/event/findOneEvent?eventID=${eventID}`, token);
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);
            // עובר על כל הארוחות באירוע ומעדכן את המצב בהתאם
            fetchData.data.decorations.forEach((decoration, index) => {
                if (decoration != null) {
                    // מציב את המידע של הארוחה בשדות המתאים 
                    const option = `option${index + 1}`;
                    handleChange({ target: { name: `${option}.table`, value: decoration.table } });
                    handleChange({ target: { name: `${option}.map`, value: decoration.map } });
                    handleChange({ target: { name: `${option}.extra1`, value: decoration.extra1 } });
                    handleChange({ target: { name: `${option}.extra2`, value: decoration.extra2 } });
                    handleChange({ target: { name: `${option}.amount`, value: decoration.amount } });
                    handleChange({ target: { name: `${option}.price`, value: decoration.price } });
                }
            });
        } catch (error) {
            // מדפיס שגיאה אם יש
            console.error(error);
        }
    }

    // useEffect- קומפוננטה המופעלת לאחר פעולה שמתבצעת 
    // במקרה הזה זה קורה פעם אחת כשמעלים את העמוד 
    // שלב 1:
    useEffect(() => {
        fetch_findProductByCategory();
    }, []); // מערך ריק פירושו שהאפקט הזה פועל פעם אחת בהעלעת העמוד

    // שלב 2:
    useEffect(() => {
        console.log("Products: " + JSON.stringify(products));
        console.log("Event ID: " + query_eventid);
        fetchData(query_eventid)
    }, [products]); //  משתנה products אפקט זה פועל בכל פעם ש 

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [option, field] = name.split('.');
        setFormData(prevState => ({
            ...prevState,
            [option]: {
                ...prevState[option],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (event) => {
        //לא לבצע רענון לעמוד
        // על מנת לא לאבד את הנתונים שהצבנו באינפותים ועל מנת לעדכין את השינויים בשרת 
        event.preventDefault();
        try {
            for (let i = 1; i <= 2; i++) {
                let decoration = formData[`option${i}`]
                if (decoration != null) {
                    if (decoration.table == "" || decoration.map == "" || decoration.extra1 == "" || decoration.extra2 == "")
                        return
                    const filter_table = products.filter(item => item._id === decoration.table);
                    const filter_map = products.filter(item => item._id === decoration.map);
                    const filter_extra1 = products.filter(item => item._id === decoration.extra1);
                    const filter_extra2 = products.filter(item => item._id === decoration.extra2);
                    decoration.price = (filter_table[0].price + filter_map[0].price + filter_extra1[0].price + filter_extra2[0].price) * decoration.amount;
                }
            }

            // מידע להעברה
            let tempData = {
                eventID: query_eventid,
                data: JSON.stringify({ decorations: formData }),
            };
            // פניה לשרת
            const fetchData = await fetch_URL_POST("http://localhost:5000/event/updateMealsOrDecoration", token, tempData);
            // הצוות נתונים במשתנים
            setStatus(fetchData.status);
            setMessage(fetchData.message);
            setData(fetchData.data);

            //fetchData(query_eventid); //טעינה מחדש לנתונים מהשרת
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
                    <h5>Option 1</h5>
                    <label>
                        Table:
                        <select name="option1.table" value={formData.option1.table} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Table")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Map Color:
                        <select name="option1.map" value={formData.option1.map} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Map")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Extra1:
                        <select name="option1.extra1" value={formData.option1.extra1} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Extra1")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Extra2:
                        <select name="option1.extra2" value={formData.option1.extra2} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Extra1")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="option1.amount" value={formData.option1.amount} onChange={handleChange} min="1" required />
                    </label>
                    <label>
                        Total Price:
                        <input disabled type="number" name="option1.price" value={formData.option1.price} />
                    </label>
                    <h5>Option 2</h5>
                    <label>
                        Table:
                        <select name="option2.table" value={formData.option2.table} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Table")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Map Color:
                        <select name="option2.map" value={formData.option2.map} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Map")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Extra1:
                        <select name="option2.extra1" value={formData.option2.extra1} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Extra1")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Extra2:
                        <select name="option2.extra2" value={formData.option2.extra2} onChange={handleChange} required>
                            <option value="">Select...</option>
                            {products
                                .filter(item => item.category === "Extra1")
                                .map(item => (
                                    <option value={item._id}>{item.name} ({item.price})₪</option>
                                ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="option2.amount" value={formData.option2.amount} onChange={handleChange} min="1" required />
                    </label>
                    <label>
                        Total Price:
                        <input disabled type="number" name="option2.price" value={formData.option2.price} />
                    </label>
                    <Container fluid>
                        <Row className="justify-content-center">
                            <Col xs={12} md={10}>
                                {Object(data).status === "Open" ?
                                    <input type="submit" value="Update" />
                                    : (<Alert variant="danger" className="text-center">אירוע זה סגור.</Alert>)
                                }
                                {query_eventid ?
                                    <Button variant="primary" size="lg" onClick={() => navigate(`/payment?eventid=${query_eventid}`)} >Next Page</Button>
                                    : <></>
                                }
                            </Col>
                        </Row>
                    </Container>
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

export default SelectADecoration;