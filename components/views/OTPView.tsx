import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ArrowLeftIcon } from '../Icon';

interface OTPViewProps {
    role: UserRole;
    onVerifySuccess: () => void;
    onBack: () => void;
}

const OTPView: React.FC<OTPViewProps> = ({ role, onVerifySuccess, onBack }) => {
    const [otp, setOtp] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === 6) {
             // In a real app, verify OTP via API call
            console.log(`Verifying OTP: ${otp}`);
            onVerifySuccess();
        } else {
            alert('Please enter a valid 6-digit OTP.');
        }
    };
    
    const destination = role === UserRole.STUDENT ? "your personal number" : "your registered email";

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-sm">
                <button onClick={onBack} className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 transition-colors mb-6 group">
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-semibold">Back to Sign Up</span>
                </button>
                
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-100">Verify Your Account</h1>
                    <p className="text-slate-400 mt-2">An OTP has been sent to {destination}.</p>
                </div>
                
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <input 
                                id="otp"
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Enter 6-digit OTP"
                                required
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-4 text-center text-2xl tracking-[0.5em] font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <button type="submit" className="w-full p-3 bg-sky-600 hover:bg-sky-500 rounded-lg transition font-bold text-white shadow-lg shadow-sky-600/20">
                            Verify & Create Account
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <button className="text-sm text-sky-400 hover:underline">
                            Didn't receive the code? Resend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPView;