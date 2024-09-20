import React, { useEffect, useState } from 'react';
import Menu from '../menu'; // make sure the path is correct
import styled from 'styled-components';
import Table from 'react-bootstrap/Table';

const MainContent = styled.div`
    margin-right: 1%; // Adjust this value as needed
    margin-left: 1%; // Adjust this value as needed
`;
function PrintAll() {
  const token = localStorage.getItem('jwt-token');
  const [data, setData] = useState(null);
  const [inputs, setInputs] = useState({});
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchResponse = await fetch("http://localhost:5000/user/printall", { // לאיזה כתובת לפנות 
          method: "GET", // שיטה הפניה 
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`// שיטת ההצפנה 
          }
        });

        setStatus(`${fetchResponse.status}`);
        if (!fetchResponse.ok) {
          let responseText = await fetchResponse.text();
          setMessage(responseText);
          throw new Error(`[Error] Status: ${fetchResponse.status} Response: ${responseText}`);
        }
        const dataJSON = await fetchResponse.json();
        setMessage("Success");
        setData(dataJSON);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []); // Empty array means this effect runs once on mount

  return (
    <div>
      <Menu /> {/* Here's your NavBar component */}
      <MainContent>
        <br></br>
        <div class="form">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Index</th>
                <th>ID</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            {data ? data.map((item, index) => (
              <tbody>
                <tr>
                  <td>{index}</td>
                  <td>{item._id}</td>
                  <td>{item.username}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.email}</td>
                </tr>
              </tbody>
            )) : <p>Loading...</p>
            }
          </Table>
          <p>[MESSAGE] {message}</p>
          {process.env.REACT_APP_TESTING === 'TRUE' ?
            <>
              <h5>Testing Mode</h5>
              <p>[STATUS] {status}</p>
              <p>[JSON] {JSON.stringify(data)}</p>
            </> : null
          }
        </div>
      </MainContent>
    </div>
  );
}

export default PrintAll;