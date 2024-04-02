export interface MessageResponse {
  success: boolean;
  message: string | undefined;
  error: string[] | undefined;
  data?: object | unknown[] | undefined;
}

const generateResponse = (success: boolean, message: string, data: any, error?: string[]): MessageResponse => ({
  success,
  message,
  error,
  data,
});

export default generateResponse;
