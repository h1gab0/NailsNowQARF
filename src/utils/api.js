import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const fetchInstanceData = async (username) => {
  try {
    const [
      instanceRes,
      appointmentsRes,
      availabilityRes,
      couponsRes,
    ] = await Promise.all([
      api.get(`/instances/${username}`),
      api.get(`/${username}/appointments`),
      api.get(`/${username}/availability/dates`),
      api.get(`/${username}/coupons`),
    ]);

    return {
      instance: instanceRes.data,
      appointments: appointmentsRes.data,
      availability: availabilityRes.data,
      coupons: couponsRes.data,
    };
  } catch (error) {
    console.error('Error fetching instance data:', error);
    throw error;
  }
};

export default api;
