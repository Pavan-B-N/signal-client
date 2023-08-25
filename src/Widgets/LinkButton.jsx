import React from 'react'

function LinkButton(props) {
    const css={
        padding:"2px",
        border:"none",
        outline:"none",
        background:"white",
        color:"blue",
        fontWeight:"bold",
        cursor:"pointer"
    }
   
  return (
    <>
      <button style={css} onClick={props.onClick}>{props.children}</button>
    </>
  )
}

export default LinkButton
