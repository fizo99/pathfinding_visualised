import React from "react";

const SelectField = (props) => {
  return (
    <select
      id={props.id}
      onChange={props.handleAnimationSpeed}
      defaultValue={props.defaultValue}
    >
      <option hidden disabled value={props.defaultValue}>
        {props.defaultValue}
      </option>
      {props.options.map((option, optionID) => {
        return (
          <option key={optionID} value={option}>
            {option}
          </option>
        );
      })}
    </select>
  );
};

export default SelectField;
