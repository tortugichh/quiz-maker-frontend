import React from 'react';

const Loader = ({ size = 'medium', fullPage = false }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return { width: '1rem', height: '1rem', borderWidth: '2px' };
      case 'large':
        return { width: '3rem', height: '3rem', borderWidth: '4px' };
      case 'medium':
      default:
        return { width: '2rem', height: '2rem', borderWidth: '3px' };
    }
  };

  const sizeStyles = getSizeClass();
  
  const spinnerStyle = {
    display: 'inline-block',
    borderRadius: '50%',
    border: `${sizeStyles.borderWidth} solid rgba(0, 0, 0, 0.1)`,
    borderTopColor: 'var(--primary-color)',
    width: sizeStyles.width,
    height: sizeStyles.height,
    animation: 'spin 0.6s linear infinite'
  };
  
  const containerStyle = fullPage ? {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    width: '100%'
  } : {};

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
    </div>
  );
};

export default Loader;