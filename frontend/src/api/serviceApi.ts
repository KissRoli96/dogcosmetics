import api from './api';
import { Service, ErrorResponse} from '../types/types';


export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get<Service[]>('/services');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getService = async (id: string): Promise<Service> => {
  try {
    const response = await api.get<Service>(`/service/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createService = async (serviceData: Partial<Service>): Promise<Service | ErrorResponse> => {
  try {
      const response = await api.post<Service>('/service', serviceData);
      return response.data;
  } catch (error: any) {
      if (error.response && error.response.data) {
          return { error: error.response.data.message };
      }
      throw error;
  }
};

export const updateService = async (id: string, serviceData: Partial<Service>): Promise<Service | ErrorResponse> => {
  try {
    const response = await api.put<Service>(`/service/${id}`, serviceData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
        return { error: error.response.data.message };
    }
    throw error;
  }
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/service/${id}`);
    return true;
  } catch (error) {
    throw error;
    return false;
  }
};

export const getServicesByUserId = async (userId: string): Promise<Service[]> => {
  try {
    const response = await api.get<Service[]>(`/services?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get services for user with id ${userId}: ${(error as Error).message}`);
  }
}