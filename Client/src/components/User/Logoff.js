import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Logoff() {
    const navigate = useNavigate(); // פונקציה של רייאקט דום להעברת מידע בזמן מעבר לעמוד אחר          
    useEffect(() => {
        async function Main() {
            try {
                localStorage.removeItem('jwt-token'); //Remove the JWT Token
                navigate("/login");
            } catch (error) {
                console.error(error);
            }
        }
        Main(); //Call the Main function
    }, []); // Empty array means this effect runs once on mount
}

export default Logoff;