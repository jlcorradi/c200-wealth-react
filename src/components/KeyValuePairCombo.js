import React, { useEffect, useState } from 'react'
import KeyValuePairService from '../services/KeyValuePairService';

function KeyValuePairCombo({ type, label, value, onChange, errorObject }) {

    useEffect(() => KeyValuePairService.list(type)
        .then(({ data }) => setList(data)), []);

    let [list, setList] = useState([]);

    return (
        <>
            {label && <label htmlFor="categoryId">{label}</label>}
            <select name="categoryId" id="categoryId" onChange={(e) => onChange(e.target.value)} value={value}>
                <option value="" defaultValue>Select</option>
                {list.map((c) => <option value={c.id} key={c.id}>{c.description}</option>)}
            </select>
            <small>{errorObject["categoryId"]}</small>
        </>
    )
}

export default KeyValuePairCombo
