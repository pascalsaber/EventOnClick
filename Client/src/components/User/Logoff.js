import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function Logoff() {
    const navigate = useNavigate(); // פונקציה של רייאקט דום להעברת מידע בזמן מעבר לעמוד אחר          
    useEffect(() => {
        try {
            localStorage.removeItem('jwt-token'); //Remove the JWT Token
            navigate("/login");
        } catch (error) {
            console.error(`[Error] ${error}`);
        }
    }, []); // Empty array means this effect runs once on mount*/
}

export default Logoff;