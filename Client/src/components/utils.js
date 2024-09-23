// utils.js
export async function checkLogin(navigate, token) {
    try {
        if (!token)
            navigate("/logoff");
        const fetchResponse = await fetch("http://localhost:5000/user/profile", { // לאיזה כתובת לפנות 
            method: "GET", // שיטה הפניה 
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`// שיטת ההצפנה 
            }
        });
        if (fetchResponse.status == 401)
            return navigate("/logoff");
    } catch (error) {
        console.error(error);
    }
}