import React from 'react'

export default function Select2({ name, val1, defaultSelect, data, handleChange }) {
    return (
        <div>
            <select value={val1} onChange={handleChange} name={name} className="form-select form-select-sm mb-3" aria-label="Small select example">
                <option defaultValue>{defaultSelect}</option>
                {data.map((d,index) => <option key={index} value={d}>{d}</option>)}
            </select>
        </div>
    )
}