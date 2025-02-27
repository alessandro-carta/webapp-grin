import React from 'react';

function LoadingButton() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-5 h-5 border-2 border-t-transparent border-cgray-2 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingButton;