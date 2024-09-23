import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;

function SelectADecoration() {
    const token = localStorage.getItem('jwt-token');
    const navigate = useNavigate(); // פונקציה של ריאקט דום להעברת מידע בזמן מעבר לעמוד אחר   

    const [data, setData] = useState(null); // מידע שהתקבל מבסיס הנתונים
    const [status, setStatus] = useState(""); // עבור מצב הבקשה כמספר כגון 200 - תקין
    const [message, setMessage] = useState(""); // עבור הודעה שיצרנו שמתקבלת בפניה לשרת

    const initialFormData = {
        cardholderName: '',
        cardNumber: '',
        cardHolderId: '',
        expiryDate: '',
        securityCode: '',
        totalCost: ''
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
    async function fetch_findProductByCategory() {
        //לשרת עם הקטגוריה שנבחרה POST שולח בקשת
        const fetchResponse = await fetch(`http://localhost:5000/product/findProductByCategory`, {
            method: "POST", // שיטה הפניה
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`// שיטת ההצפנה 
            }
        });
        if (fetchResponse.ok) { // בודק אם הבקשה הצליחה
            let responseJSON = await fetchResponse.json(); //JSON- ממיר את התגובה ל
            setProducts(responseJSON);
        }
    }
    // הפונקציה הזו נועדה להביא נתונים על אירוע מסוים מהשרת ולעדכן את המצב בהתאם
    async function fetchData(eventID) {
        try {
            //eventID לשרת עם get שולח בקשת 
            const fetchResponse = await fetch(`http://localhost:5000/event/findOneEvent?eventID=${eventID}`, {
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
            setMessage("Success"); //TEMP
            setData(dataJSON);
            // עובר על כל הארוחות באירוע ומעדכן את המצב בהתאם
            dataJSON.decorations.forEach((decoration, index) => {
                if (decoration != null) {
                    // מסנן את רשימת הארוחות לפי הארוחה הראשונה והשנייה
                    // על מנת להעזר בה בלדעת את מחיר המוצר
                    if (decoration.table == "" || decoration.map == "" || decoration.extra1 == "" || decoration.extra2 == "")
                        return
                    const filter_table = products.filter(item => item.name === decoration.table);
                    const filter_map = products.filter(item => item.name === decoration.map);
                    const filter_extra1 = products.filter(item => item.name === decoration.extra1);
                    const filter_extra2 = products.filter(item => item.name === decoration.extra2);
                    console.log("filtered..." + JSON.stringify(filter_table))
                    console.log("filtered..." + filter_table[0].price)
                    // מעדכן את המצב של הארוחות והמחיר
                    const option = `option${index + 1}`;
                    handleChange({ target: { name: `${option}.table`, value: decoration.table } });
                    handleChange({ target: { name: `${option}.map`, value: decoration.map } });
                    handleChange({ target: { name: `${option}.extra1`, value: decoration.extra1 } });
                    handleChange({ target: { name: `${option}.extra2`, value: decoration.extra2 } });
                    handleChange({ target: { name: `${option}.amount`, value: decoration.amount } });
                    let totalPrice = (filter_table[0].price + filter_map[0].price + filter_extra1[0].price + filter_extra2[0].price) * decoration.amount;
                    handleChange({ target: { name: `${option}.price`, value: totalPrice } });
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
        if (!token)   //מוודא שהתוקן של המשתמש עדיין בתוקף אחרת מחזירה את המשתמש לעמוד ההתחברות מחדש
            navigate("/login");
        fetch_findProductByCategory();
    }, []); // מערך ריק פירושו שהאפקט הזה פועל פעם אחת בהעלעת העמוד

    // שלב 2:
    useEffect(() => {
        console.log("Products: " + JSON.stringify(products));
        console.log("Event ID: " + query_eventid);
        fetchData(query_eventid)
    }, [products]); //  משתנה products אפקט זה פועל בכל פעם ש 

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value })) //input["id"] = "9snahdf8ui4hi34uh5"
    }
    /*const handleChange = (e) => {
        const { name, value } = e.target;
        const [option, field] = name.split('.');
        setFormData(prevState => ({
            ...prevState,
            [option]: {
                ...prevState[option],
                [field]: value
            }
        }));
    };*/

    const handleSubmit = async (event) => {
        //לא לבצע רענון לעמוד
        // על מנת לא לאבד את הנתונים שהצבנו באינפותים ועל מנת לעדכין את השינויים בשרת 
        event.preventDefault();
        try {
            const fetchResponse = await fetch("http://localhost:5000/event/updatePayment", { // לאיזה כתובת לפנות 
                method: "POST", // שיטה הפניה
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`// שיטת ההצפנה 
                },
                body: JSON.stringify(
                    { // המרת המידעה שנשלח כבדי מהטופס לאקספרס
                        // האינפוט הוא המידעה שנרשם בטופס
                        eventID: query_eventid,
                        data: JSON.stringify({ payments: formData }),
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
            const dataJSON = await fetchResponse.json();
            setMessage("Success");
            setData([dataJSON]);
            fetchData(query_eventid)
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
                                    <option value={item.name}>{item.name} ({item.price})₪</option>
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
                                    <option value={item.name}>{item.name} ({item.price})₪</option>
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
                                    <option value={item.name}>{item.name} ({item.price})₪</option>
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
                                    <option value={item.name}>{item.name} ({item.price})₪</option>
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
                                    <option value={item.name}>{item.name} ({item.price})₪</option>
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
                                    <option value={item.name}>{item.name} ({item.price})₪</option>
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
                                    <option value={item.name}>{item.name} ({item.price})₪</option>
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
                                    <option value={item.name}>{item.name} ({item.price})₪</option>
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
                 
                    <input type="submit" value="Update" />
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