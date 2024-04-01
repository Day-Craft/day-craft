export default interface MessageResponse {
  success: boolean;
  message: string | undefined;
  error: string | undefined;
  data?: object | unknown[] | undefined;
}
