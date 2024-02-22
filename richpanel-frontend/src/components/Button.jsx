import React from "react";
import classNames from "classnames";

export function Button({ onClick, className, children, btnText, ...otherProps }) {
    return (
        <button onClick={onClick} className={classNames("btn-container", className)} {...otherProps}>
            {children} {btnText}
        </button>
    )
}
