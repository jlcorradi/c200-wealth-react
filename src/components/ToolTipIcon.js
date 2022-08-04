import classNames from 'classnames'
import React from 'react'

function ToolTipIcon({children, icon}) {
    return (
        <div className="tootip">
            <i className={classNames("bx", icon, {"bxs-info-circle": !icon})}></i>
            <div className="tooltip-content">

            </div>
        </div>
        
    )
}

export default ToolTipIcon
