import React from 'react';

const FormSubmit = ({ state, onClick, value }) => {
  return (
    <input
      type="submit"
      className={state}
      onClick={onClick}
      value={value}
    />
  )
}

export default FormSubmit;