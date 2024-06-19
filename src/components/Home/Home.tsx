import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { useEffect } from 'react';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { BackButton } = useTelegram();

    useEffect(() => {
        if (BackButton.isVisible === true) {
            BackButton.hide();
        }
    }, [BackButton]);

    const openCamera = () => {
        navigate('/camera');
    };

    return (
        <div className="component">
            <button className="adjustable-button" onClick={openCamera}>
                Open Camera
            </button>
        </div>
    );
};

export default Home;
