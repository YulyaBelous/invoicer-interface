import Pagination from 'react-bootstrap/Pagination';
import {useEffect, useState} from "react";

const Pageable = (props) => {
    const {totalPages, number} = props.pageable;
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        number? setCurrentPage(number+1) : setCurrentPage(1);
    }, []);

    const handleClick = (curPage) => {
        if(curPage > 0 && curPage <= totalPages) {
            setCurrentPage(curPage);
            props.setPage(curPage - 1);
        }
    }

    return (
        <Pagination >
            <Pagination.First onClick={() => handleClick(1)}/>
            <Pagination.Prev onClick={() => handleClick(currentPage - 1)}/>
                {currentPage > 1? <Pagination.Item onClick={() => handleClick(1)}>{1}</Pagination.Item> : null}
                {currentPage === 3? <Pagination.Item onClick={() => handleClick(currentPage - 1)}>{currentPage-1}</Pagination.Item>: null}

                {currentPage > 3? (
                    <>
                            {props.currentPage !== 4? <Pagination.Ellipsis />: null}
                            <Pagination.Item onClick={() => handleClick(currentPage - 2)}>{currentPage-2}</Pagination.Item>
                            <Pagination.Item onClick={() => handleClick(currentPage - 1)}>{currentPage-1}</Pagination.Item>
                    </>
                    ) : (null)
                }

            <Pagination.Item active>{currentPage}</Pagination.Item>
            {totalPages > 2 && currentPage < totalPages-1? <Pagination.Item onClick={() => handleClick(currentPage + 1)}>{currentPage+1}</Pagination.Item> : null}
            {totalPages > 3 && currentPage < totalPages-2? <Pagination.Item onClick={() => handleClick(currentPage + 2)}>{currentPage+2}</Pagination.Item> : null}

            {totalPages > 4 && currentPage < totalPages-3? <Pagination.Ellipsis /> : null}
            {currentPage !== totalPages && totalPages !== 0? <Pagination.Item onClick={() => handleClick(totalPages)}>{totalPages}</Pagination.Item> : null}
            <Pagination.Next onClick={() => handleClick(currentPage + 1)}/>
            <Pagination.Last onClick={() => handleClick(totalPages)}/>
        </Pagination>
    );
}

export default Pageable;