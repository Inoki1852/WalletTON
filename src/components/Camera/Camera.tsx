import './Camera.css';
import React, { useRef, useState, useEffect, useCallback, RefObject } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const Camera: React.FC = () => {
    const videoRef: RefObject<HTMLVideoElement> = useRef(null);
    const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const { MainButton, BackButton } = useTelegram();
    const navigate = useNavigate();


    const takePhoto = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/png');
        setPhoto(photoData);
    }, [videoRef, canvasRef]);


    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => device.kind === 'videoinput' && device.label);
                setDevices(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedDeviceId(videoDevices[0].deviceId);
                } else {
                    setError('No camera devices found');
                }
            } catch (err: any) {
                console.error('Error enumerating devices', err);
                setError('Error enumerating devices: ' + err.message);
            }
        };

        getDevices();
    }, []);


    useEffect(() => {
        const startCamera = async (videoElement: HTMLVideoElement | null) => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const constraints = {
                        video: {
                            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
                        },
                    };
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (videoElement) {
                        videoElement.srcObject = stream;
                        videoElement.play();
                    }
                } catch (err: any) {
                    console.error('Error accessing the camera', err);
                    setError('Error accessing the camera: ' + err.message);
                }
            } else {
                setError('getUserMedia is not supported by your browser');
            }
        };

        const videoElement = videoRef.current;

        if (selectedDeviceId) {
            startCamera(videoElement);
        }

        return () => {
            if (videoElement && videoElement.srcObject) {
                (videoElement.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
            }
        };
    }, [selectedDeviceId]);


    useEffect(() => {
        const backButtonOnClick = () => {
            MainButton.hide();
            navigate('/');
        };

        if (error) {
            MainButton.hide();
        } else {
            MainButton.show();
            MainButton.setText('Make photo');
            MainButton.onClick(takePhoto);
        }

        if (!BackButton.isVisible) {
            BackButton.show();
        }

        BackButton.onClick(backButtonOnClick);

        return () => {
            MainButton.offClick(takePhoto);
            BackButton.offClick(backButtonOnClick);
        };
    }, [error, MainButton, BackButton, navigate, takePhoto]);


    const requestCameraAccess = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setError(null);
        } catch (err: any) {
            console.error('Error accessing the camera', err);
            setError('Error accessing the camera: ' + err.message);
        }
    };


    return (
        <div className="component Camera">
            {error && (
                <div>
                    <p style={{ color: 'red' }}>{error}</p>
                    <button className="adjustable-button" onClick={requestCameraAccess}>
                        Request Camera Access
                    </button>
                </div>
            )}
            {!error && (
                <div>
                    <video ref={videoRef} autoPlay className="capture-block"></video>
                    <br />
                    <div>
                        <label htmlFor="videoSource">Select Camera: </label>
                        <select
                            id="videoSource"
                            className="select-custom"
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            value={selectedDeviceId}
                        >
                            {devices.map((device) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Camera ${devices.indexOf(device) + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <canvas ref={canvasRef} className="canvas"></canvas>
                    {photo && (
                        <div>
                            <h2>Captured Photo:</h2>
                            <img src={photo} alt="Captured" className="capture-block" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Camera;
