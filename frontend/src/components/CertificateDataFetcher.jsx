import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import EduSphereCertificate from './Certificate'; // Your component
import { backendUrl } from '../App';

const CertificateDataFetcher = () => {
    const location = useLocation();
    const [recipientName, setRecipientName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [certificateId, setCertificateId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = location.state?.userId;
    const courseId = location.state?.courseId;

    useEffect(() => {
        const fetchCertificateData = async () => {
            if (!userId || !courseId) {
                setError("Missing user or course ID. Please navigate from the dashboard.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);

                // Fetch certificate data
                const certificateResponse = await axios.get(`${backendUrl}/api/certificate/${userId}/${courseId}`);
                setIssueDate(certificateResponse.data.completionDate || 'Unknown Date');
                setCertificateId(certificateResponse.data.certificateId || 'Unknown ID');

                // Fetch user data
                const email = localStorage.getItem('email');
                const userResponse = await axios.get(`${backendUrl}/api/auth/display?email=${email}`);
                setRecipientName(`${userResponse.data.fname} ${userResponse.data.lname}` || 'Unknown User');

                // Fetch course data
                const courseResponse = await axios.get(`${backendUrl}/api/courses/${courseId}`);
                setCourseName(courseResponse.data.title || 'Unknown Course');
                
                setError(null);
            } catch (err) {
                console.error("Failed to fetch certificate data:", err);
                setError("Failed to load certificate. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificateData();
    }, [userId, courseId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p>Loading certificate data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', color: 'red' }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    // Render the presentational component with the fetched data as props
    return <EduSphereCertificate recipientName={recipientName} courceName={courseName} issueDate={issueDate} certificateId={certificateId} />;
};

export default CertificateDataFetcher;