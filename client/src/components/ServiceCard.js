import React from 'react';

export const ServiceCard = ({ source, logopath, handleClick }) => {
  return(
    <div
      className="service-card"
      onClick={handleClick}>
      <img src={logopath} alt={source}/>
      <h2>{source}</h2>
    </div>
  )
}
