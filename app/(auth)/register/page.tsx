"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [password, setPassword] = useState("");

  const getStrengthColors = (val: string) => {
    const len = val.length;
    const olive = '#8FA96E';
    const dim = '#dcdad6';

    if (len === 0) return [dim, dim, dim];
    if (len > 0 && len <= 4) return [olive, dim, dim];
    if (len > 4 && len <= 8) return [olive, olive, dim];
    return [olive, olive, olive];
  };

  const colors = getStrengthColors(password);

  return (
    <div className="w-full max-w-[400px] bg-white border border-[#E8E6E1] rounded-[6px] p-9 mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2" style={{ fontSize: '20px', fontWeight: 500 }}>inklog</h1>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-1" style={{ fontSize: '22px', fontWeight: 400 }}>Create an account</h2>
        <p className="font-body-md text-body-md text-on-surface-variant" style={{ fontSize: '14px' }}>Join us to start writing.</p>
      </div>

      <form action="#" className="space-y-5" method="POST">
        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="name">Full name</label>
          <input 
            className="border border-[#E8E6E1] rounded-[4px] block w-full px-3 py-2 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-[#8FA96E] focus:outline-none focus:ring-0 transition-colors" 
            id="name" 
            name="name" 
            required 
            type="text" 
          />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="username">Username</label>
          <input 
            className="border border-[#E8E6E1] rounded-[4px] block w-full px-3 py-2 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-[#8FA96E] focus:outline-none focus:ring-0 transition-colors" 
            id="username" 
            name="username" 
            required 
            type="text" 
          />
          <p className="mt-1 font-caption text-caption text-on-surface-variant/70">This will be your public author name.</p>
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="email-reg">Email address</label>
          <input 
            autoComplete="email" 
            className="border border-[#E8E6E1] rounded-[4px] block w-full px-3 py-2 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-[#8FA96E] focus:outline-none focus:ring-0 transition-colors" 
            id="email-reg" 
            name="email" 
            required 
            type="email" 
          />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="password-reg">Password</label>
          <input 
            className="border border-[#E8E6E1] rounded-[4px] block w-full px-3 py-2 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-[#8FA96E] focus:outline-none focus:ring-0 transition-colors" 
            id="password-reg" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            type="password" 
          />
          {/* Password Strength Bar */}
          <div className="mt-2 flex gap-1 h-1 w-full">
            <div className="flex-1 rounded-full transition-colors duration-300" style={{ backgroundColor: colors[0] }}></div>
            <div className="flex-1 rounded-full transition-colors duration-300" style={{ backgroundColor: colors[1] }}></div>
            <div className="flex-1 rounded-full transition-colors duration-300" style={{ backgroundColor: colors[2] }}></div>
          </div>
        </div>

        <div className="pt-2">
          <button 
            className="bg-[#8FA96E] text-white h-[38px] rounded-[6px] hover:opacity-90 transition-opacity w-full flex justify-center items-center font-label-md text-label-md font-medium" 
            type="submit"
          >
            Create account
          </button>
        </div>
      </form>

      <p className="mt-6 text-center font-body-md text-body-md text-on-surface-variant" style={{ fontSize: '14px' }}>
        Already have an account?{" "}
        <Link href="/login" className="text-[#8FA96E] hover:opacity-80 transition-opacity font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
