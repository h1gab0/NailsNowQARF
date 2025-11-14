import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchInstanceData as fetchApiInstanceData } from '../utils/api';

const InstanceContext = createContext(null);
const channel = new BroadcastChannel('instance-refresh');

export const useInstance = () => {
    return useContext(InstanceContext);
};

export const InstanceProvider = ({ children }) => {
    const { username } = useParams();
    const id = username || 'default';

    const [instanceData, setInstanceData] = useState({
        instance: null,
        appointments: [],
        availability: {},
        coupons: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInstanceData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchApiInstanceData(id);
            setInstanceData(data);
        } catch (err) {
            setError(err);
            if (err.response && err.response.status === 404) {
                setInstanceData(prevData => ({ ...prevData, instance: { name: 'Nail Salon Scheduler' } }));
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchInstanceData();

        const handleMessage = (event) => {
            if (event.data.type === 'refresh' && event.data.instanceId === id) {
                fetchInstanceData();
            }
        };

        channel.addEventListener('message', handleMessage);

        return () => {
            channel.removeEventListener('message', handleMessage);
        };
    }, [fetchInstanceData, id]);

    const refreshInstanceData = useCallback(() => {
        fetchInstanceData();
        channel.postMessage({ type: 'refresh', instanceId: id });
    }, [fetchInstanceData, id]);

    const value = {
        instanceId: id,
        ...instanceData,
        loading,
        error,
        refreshInstanceData,
    };

    return (
        <InstanceContext.Provider value={value}>
            {children}
        </InstanceContext.Provider>
    );
};
