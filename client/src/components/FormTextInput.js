import React from 'react';

const FormTextInput = ({ type, label, name, id, onChange, state }) => {
  return (
    <label>
      <span className="form-label">{label}</span>
      <input
        type={ type === "password" ? "password":"text"}
        name={name}
        id={id}
        onChange={onChange}
        className={state}
      />
    </label>
  )
}

export default FormTextInput;