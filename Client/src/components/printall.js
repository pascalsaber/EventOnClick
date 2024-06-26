import React, { useEffect, useState } from 'react';
import Menu from './menu'; // make sure the path is correct
import styled from 'styled-components';

const MainContent = styled.div`
  margin-left: 160px; // Adjust this value as needed
`;
// על מנת לשנות משתנים 
function PrintAll() {
  const [data, setData] = useState(null);
//
  useEffect(() => {
    fetch('http://localhost:5000/user/printall') // replace with your API endpoint
      .then(response => response.json())//jsonל apiממיר את המידע שהתקבל מ
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []); // Empty array means this effect runs once on mount

  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Menu /> {/* Here's your NavBar component */} 
      <MainContent>
        {/* Render your data here */}
        {data.map((item, index) => (
          <form>
            <table>
              <tr>
                <td style={{ width: "200px" }} >Index: {index}</td>
                <td style={{ width: "250px" }} >ID: {item._id}</td>
                <td style={{ width: "100px" }} >Username: {item.username}</td>
                <td style={{ width: "250px" }} >Password: {item.password}</td>
                <td style={{ width: "100px" }}><img src={item.image} width={40} height={40} /></td>
                <td style={{ width: "250px" }}>First Name: {item.firstName}</td>
                <td style={{ width: "250px" }}>Last Name: {item.lastName}</td>
                <td style={{ width: "100px" }} >Price: {item.price}</td>
                <td style={{ width: "100px" }} ><input type="submit" value="Add" /></td>
              </tr>
            </table>
          </form>
        ))}
        {JSON.stringify(data)}
      </MainContent>
    </div>
  );
}

export default PrintAll;