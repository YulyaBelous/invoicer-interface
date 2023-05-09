import {ArrowDown, ArrowUp} from "react-bootstrap-icons";

const ViewArrowSort = (props) => {
    let classNameArrowUp = "defaultArrow", classNameArrowDown = "defaultArrow";
    if(props?.sortParam === props?.keySort) {
        if(props?.isSort) {
            classNameArrowUp = "activeArrow";
        } else {
            classNameArrowDown = "activeArrow";
        }
    }
    return (
        <>
            <ArrowDown className={classNameArrowDown} style={{marginRight: -8}}/>
            <ArrowUp className={classNameArrowUp}/>
        </>
    )
}

export default ViewArrowSort;