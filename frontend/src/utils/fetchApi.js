import axios from 'axios';

const fetchApi = async (url, method = 'GET', data = {}, token = null) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios({
            url: process.env.REACT_APP_API_BASE_URL + url,
            method,
            data,
            headers,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Server Error:', error.response.status, error.response.data);
            throw new Error(`Server Error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.request);
            throw new Error('Network Error: No response received from server');
        } else {
            // Something else happened while setting up the request
            console.error('Error:', error.message);
            throw new Error(`Error: ${error.message}`);
        }
    }
};

export default fetchApi;