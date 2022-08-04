import classNames from 'classnames';
import React from 'react'

function OrderToggle({ field, order, description, onChange }) {

    function getIsDescending () {
        const re = /(.*)\((.*)\)/;
        let array = re.exec(order);
        return array[2].toUpperCase() === "DESC";
    }

    function changeOrder(e) {
        let descending = !getIsDescending();
        let newOrder = `${field}(${descending ? "DESC" : "ASC"})`;
        onChange(newOrder);
    }

    return (
        <span className={classNames("order-toggle", { "active": order.includes(field), "descending": getIsDescending() })}
            onClick={changeOrder}><span>{description}</span></span>
    )
}

export default OrderToggle
