export interface DataEnvelope<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  error?: string;
}

export interface ErrorEnvelope {
  status: 'error';
  message: string;
  error?: string;
  data: null;
}

export function successEnvelope<T>(message: string, data: T): DataEnvelope<T> {
  return {
    status: 'success',
    message,
    data,
  };
}

export function errorEnvelope(message: string, error?: string): ErrorEnvelope {
  return {
    status: 'error',
    message,
    error,
    data: null,
  };
}
