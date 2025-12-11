import React from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-8 rounded-xl font-semibold text-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-teal text-white shadow-lg shadow-brand-teal/30 hover:brightness-110",
    secondary: "bg-brand-purple text-white shadow-lg shadow-brand-purple/30 hover:brightness-110",
    outline: "bg-transparent border-2 border-brand-teal text-brand-teal hover:bg-brand-teal/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 ${className} transition-transform hover:-translate-y-1 duration-300`}>
    {children}
  </div>
);

// --- Stat Card ---
export const StatCard: React.FC<{ icon: string; value: string | number; label: string }> = ({ icon, value, label }) => (
  <Card className="flex flex-col items-center justify-center text-center p-4">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-xl font-bold text-brand-darkPurple">{value}</div>
    <div className="text-xs text-brand-petrol font-medium uppercase tracking-wide">{label}</div>
  </Card>
);
