export const colors = {
  primary: '#0a7ea4',
  secondary: '#f0f0f0',
  error: '#ff4444',
  success: '#4CAF50',
  warning: '#FF9800',
  text: {
    primary: '#000000',
    secondary: '#666666',
    placeholder: '#999999',
  },
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    error: '#fff5f5',
  },
  border: {
    default: 'transparent',
    error: '#ff4444',
    focus: '#0a7ea4',
  },
};

export const spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
  xxl: 40,
};

export const typography = {
  fontSize: {
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    title: 32,
  },
  fontWeight: {
    normal: '400' as const,
    semibold: '600' as const,
    bold: 'bold' as const,
  },
};
