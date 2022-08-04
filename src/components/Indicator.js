import classNames from 'classnames'
import React from 'react'

function Indicator({ label, value, icon, color }) {
    return (
        <div className={classNames("indicator", "border-right", "border-bottom", "flex,", "flex-column", "padding", "flex-1", color)}>
            <h3 className="thin">{label}</h3>
            <div className="flex flex-row flex-1 align-items-center justify-content-space-between padding">
                <spam className="flex flex-column align-items-center justify-content center">
                    <i className={classNames("bx", icon || "bx-info-circle")}></i>
                </spam>
                <h1 className="padding text-right">{value}</h1>
            </div>
        </div>
    )
}

export default Indicator
