import React from 'react';
import { NavLink } from 'react-router-dom';
import {ArrowDown, ArrowUp} from "react-bootstrap-icons";

const SortButton = ({ sortParam, keySort, isSort, onSort }) => {

    const isActive = sortParam === keySort;
    const isAsc = isActive && isSort;

    let classNameArrowUp = "defaultArrow", classNameArrowDown = "defaultArrow";

    if(isActive) {
        isAsc? classNameArrowUp = "activeArrow" : classNameArrowDown = "activeArrow";
    }

    const handleClick = () => {
        onSort(sortParam);
    };

    return (
        <NavLink onClick={handleClick}>
            <ArrowUp className={classNameArrowUp} style={{marginRight: -8}}/>
            <ArrowDown className={classNameArrowDown}/>
        </NavLink>
    );
};

export default SortButton;