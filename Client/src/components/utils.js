// utils.js
export async function checkLogin(navigate, token) {
    try {
        if (!token)
            navigate("/logoff");
        const response = await fetch("http://localhost:5000/user/profile", { // לאיזה כתובת לפנות 
            method: "GET", // שיטה הפניה 
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`// שיטת ההצפנה 
            }
        });// בדיקה אם לאותו משתמש הטוקן פג תוקף 
        if (response.status == 401)
            return navigate("/logoff");
    } catch (error) {
        console.error(error);
    }
}

export async function fetch_URL_GET(url, token) {
    try {
        const response = await fetch(url, { // לאיזה כתובת לפנות 
            method: "GET", // שיטה הפניה 
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`// שיטת ההצפנה 
            }
        });
        if (!response.ok) { //response.status != 200
            let responseText = await response.text();
            return ({
                status: response.status,
                message: responseText,
                data: null //לא מצפים למידע תקין
            })
        }
        const dataJSON = await response.json();
        return ({
            status: response.status,
            message: "Success",
            data: dataJSON //המידע שהתקבל מהשרת
        })
    } catch (error) {
        console.error(error);
    }
}

export async function fetch_URL_POST(url, token, tempData) {
    try {
        const response = await fetch(url, { // לאיזה כתובת לפנות 
            method: "POST", // שיטה הפניה 
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`// שיטת ההצפנה 
            },
            body: JSON.stringify(tempData) // body = tempData
        });
        if (!response.ok) {
            let responseText = await response.text();
            return ({
                status: response.status,
                message: responseText,
                data: null
            })
        }
        const dataJSON = await response.json();
        return ({
            status: response.status,
            message: "Success",
            data: dataJSON
        })
    } catch (error) {
        console.error(error);
    }
}