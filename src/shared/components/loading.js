import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
    return (
        <Spinner
            style={{margin: '0 auto', background: 'none', display: 'block', width: 100, height: 100}}
            animation="border"
            role="status"
            variant="primary"
        >
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
}

export default Loading;