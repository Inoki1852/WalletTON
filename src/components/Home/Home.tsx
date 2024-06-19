import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useEffect } from 'react';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { BackButton } = useTelegram();

    useEffect(() => {
        BackButton.hide();
    }, [BackButton]);

    const openCamera = () => {
        navigate('/camera');
    };

    const openPayment = () => {
        navigate('/payment');
    }

    return (
        <div className="component">
            <button className="adjustable-button" onClick={openCamera}>
                Camera
            </button>
            <br/>
            <button className="adjustable-button" onClick={openPayment}>
                Payment
            </button>
        </div>
    );
};

export default Home;
