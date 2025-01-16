"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { withProtectedPage } from '../lib/withProtectedPage';
import ProtectedPageProps from '../types/ProtectedPageProps';

function SignUp({ csrfToken }: ProtectedPageProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
	e.preventDefault();
	try {
	  const response = await axios.post('/api/auth/signup', 
		{
		  ...formData,
		  uuid: crypto.randomUUID()
		},
		{
		  headers: {
			'X-CSRF-Token': csrfToken
		  },
		}
	  );
	  alert(response.data.message);
	} catch (error) {
	  console.error('Error signing up:', error);
	  alert('Failed to sign up. Please try again.');
	}
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
	  <input
	  	  hidden={true}
          type="text"
          name="csrf"
          placeholder="csrf"
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="middle_name"
          placeholder="Middle Name"
          value={formData.middle_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Sign Up
        </button>
      </form>
    </main>
  );
}

export default withProtectedPage(SignUp, { redirectTo: '/login' });
