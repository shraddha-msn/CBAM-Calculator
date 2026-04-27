import React from 'react'

export default function Select1({ name, val1, val2, defaultSelect, text, data, handleChange }) {
    return (
        <div>
            <select value={val1} onChange={handleChange} name={name} className="form-select form-select-sm mb-3" aria-label="Small select example">
                <option defaultValue>{defaultSelect}</option>
                {data.map((d,index) => <option key={index} value={d[val2]}> {d[val2]} - {d[text]} </option>)}
            </select>
        </div>
    )
}
