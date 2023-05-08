import Pagination from 'react-bootstrap/Pagination';

const Pageable = (props) => {
    return (
        <Pagination >
            <Pagination.First />
            <Pagination.Prev />
                {props.currentPage > 1? <Pagination.Item>{1}</Pagination.Item> : null}
                {props.currentPage === 3? <Pagination.Item>{props?.currentPage-1}</Pagination.Item>: null}

                {props.currentPage > 3? (
                    <>
                            {props.currentPage != 4? <Pagination.Ellipsis />: null}
                            <Pagination.Item>{props?.currentPage-2}</Pagination.Item>
                            <Pagination.Item>{props?.currentPage-1}</Pagination.Item>
                    </>
                    ) : (null)
                }

            <Pagination.Item active>{props?.currentPage}</Pagination.Item>
            <Pagination.Item>{props?.currentPage+1}</Pagination.Item>
            <Pagination.Item>{props?.currentPage+2}</Pagination.Item>

            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
        </Pagination>
    );
}

export default Pageable;