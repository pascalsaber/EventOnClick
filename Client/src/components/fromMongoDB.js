import { useState } from "react";
const mongoose = require('mongoose');

export default function FromMongoDB() {

    let [output, setOutput] = useState([])

    function Connect_To_MongoDB() {
        mongoose.connect('mongodb://localhost:27017/EventOnClick', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() =>
                //console.log('Database Connected Successfully'),
                setOutput(values => ({ ...values, ["message"]: 'Database Connected Successfully' }))
            )
            .catch(err =>
                //console.log(err),
                setOutput(values => ({ ...values, ["message"]: err }))
            );
    }

    Connect_To_MongoDB();
    return (
        <div>
            <h1>MongoDB Connection Status: {output.message}</h1>
        </div>
    )
}