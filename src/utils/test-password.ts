export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: 'Required' };
  }
  
  if (password.length < 8 || !/[!@#$%^&*(),?":{}|<>]/.test(password) || !/\d/.test(password)) {
    return { isValid: false, message: 'Min 8 chars, 1 number & 1 special char' };
  }
  
  return { isValid: true, message: '' };
};
