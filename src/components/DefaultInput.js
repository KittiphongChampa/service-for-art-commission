import "../css/allinput.css";
import React, { forwardRef } from "react";

export default function DefaultInput(props) {
  return (
    <>
      <label className="onInput">{props.headding}</label>
      <input
        className="defInput"
        type={props.type}
        id={props.id}
        name={props.name}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
      />
    </>
  );
}

// const DefaultInput = forwardRef((props, ref) => {
//   return (
//     <>
//       <p class="onInput">{props.headding}</p>
//       <input
//         className="defInput"
//         id={props.id}
//         name={props.name}
//         type={props.type}
//         ref={ref}
//         onChange={props.onChange}
//       />
//     </>
//   );
// });

// export default DefaultInput;
