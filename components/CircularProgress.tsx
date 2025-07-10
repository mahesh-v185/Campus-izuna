import React from 'react';

interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 30;
  const stroke = 5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 75) return 'stroke-green-500';
    if (percentage >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          className="stroke-slate-700"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`${getColor()} transition-all duration-500`}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, strokeLinecap: 'round' }}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute text-sm font-bold text-slate-200">{`${Math.round(percentage)}%`}</span>
    </div>
  );
};

export default CircularProgress;