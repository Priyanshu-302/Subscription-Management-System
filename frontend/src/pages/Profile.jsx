import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { authAPI } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
});

export default function Profile() {
  const { user, setAuth, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Use raw config defensively to protect against caching shape bugs
  const profileData = user?.data || user || {};

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profileData.name || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
    }
  });

  useEffect(() => {
    // Refresh user info upon navigating to be completely accurate 
    const loadProfile = async () => {
      try {
        const res = await authAPI.getProfile();
        // Set the active cache properly
        setAuth(res.data.data, token); 
        reset({
          name: res.data.data.name,
          email: res.data.data.email,
          phone: res.data.data.phone,
        });
      } catch (error) {
        toast.error('Failed to load latest profile');
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
       loadProfile();
    } else {
       setIsFetching(false);
    }
  }, [reset, setAuth, token]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await authAPI.updateProfile(data);
      // Backend update returns res.data.data as the fresh user
      setAuth(res.data.data, token);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-white">Profile Settings</h1>
        <p className="text-gray-400">Manage your personal information and preferences.</p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-800">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profileData.name || 'User'}</h2>
            <p className="text-gray-400">{profileData.email}</p>
          </div>
        </div>

        {isFetching ? (
           <div className="text-center py-8 text-gray-500">Loading Profile...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.name}
                {...register('name')}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email}
                {...register('email')}
              />
              <Input
                label="Phone Number"
                placeholder="+1234567890"
                error={errors.phone}
                {...register('phone')}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Card>
      
      <Card className="p-8 border-red-500/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Danger Zone</h3>
            <p className="text-sm text-gray-400">Permanently delete your account and all associated subscriptions.</p>
          </div>
          <Button variant="danger" className="shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
