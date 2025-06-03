import React from 'react';

interface DDMRPLogoProps {
  size?: number;
  className?: string;
}

export default function DDMRPLogo({ size = 48, className = '' }: DDMRPLogoProps) {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
    >
      {/* Black background for logo */}
      <div className="absolute inset-0 bg-black rounded-sm"></div>
      
      {/* First D */}
      <div className="absolute inset-0">
        <div 
          className="absolute bg-green-600" 
          style={{ 
            top: '15%', 
            left: '10%', 
            width: '35%', 
            height: '70%',
            borderRadius: '2px 0 0 2px'
          }}
        ></div>
      </div>
      
      {/* Second D */}
      <div className="absolute inset-0">
        <div 
          className="absolute bg-green-600" 
          style={{ 
            top: '15%', 
            left: '40%', 
            width: '35%', 
            height: '70%',
            borderRadius: '2px 0 0 2px'
          }}
        ></div>
      </div>
      
      {/* Yellow stripe */}
      <div 
        className="absolute bg-yellow-500 transform -rotate-12 origin-left"
        style={{ 
          top: '33%', 
          left: '30%', 
          right: '10%', 
          height: '12%' 
        }}
      ></div>
      
      {/* Red stripe */}
      <div 
        className="absolute bg-red-600 transform rotate-12 origin-left"
        style={{ 
          bottom: '33%', 
          left: '30%', 
          right: '10%', 
          height: '12%' 
        }}
      ></div>
      
      {/* DDMRP text - hidden at small sizes */}
      {size >= 48 && (
        <div 
          className="absolute text-white text-center font-bold"
          style={{
            bottom: '-28%',
            left: '0',
            right: '0',
            fontSize: `${size / 5}px`
          }}
        >
          DDMRP
        </div>
      )}
    </div>
  );
} 