import React, { useMemo } from "react";
import classNames from "classnames";
import './index.css'

export function InputText(props) {
    return (
        <div className={props.containerClassName}>
            {props.labelName &&
                <label className={classNames("form-label", props.labelClassName)}>{props.labelName}</label>}

            <input className={classNames("input-control", {
                "in-valid": props.invalid
            }) } style={{width:'100%'}}
                id={props.name}
                name={props.name}
                placeholder={props.placeHolder}
                type={props.type}
                value={props.value || ""}
                onChange={props.onChange}
                onBlur={props.onBlur}
                autoComplete="off"
                disabled={props.isDisabled}
                onKeyPress={props.onKeyPress}
            />
            {props.invalid && <div className="invalid-error">{props.error}</div>}
            {props.helperText && <div>This is the helper text</div>}
        </div>
    )
}
