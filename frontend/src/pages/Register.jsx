import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { authAPI } from "../api/auth.api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import HeroScene from "../components/3d/HeroScene";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Invalid phone number"),
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Ensure phone has +91 prefix
      const payload = {
        ...data,
        phone: data.phone.startsWith("+91") ? data.phone : `+91${data.phone}`,
      };
      await authAPI.register(payload);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <div className="hidden lg:flex w-1/2 relative bg-grid items-center justify-center">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/90 z-10 pointer-events-none" />
      </div>

      <div className="w-full lg:w-1/2 flex py-8 justify-center z-20 overflow-y-auto">
        <div className="w-full max-w-md m-auto px-4">
          <Card className="w-full p-8 bg-background/50 backdrop-blur-2xl border-glassBorder">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-400 mb-8">
                Start managing your subscriptions today.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.name}
                  {...register("name")}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email}
                  {...register("email")}
                />

                <div className="relative">
                  <Input
                    label="Phone Number"
                    placeholder="9876543210"
                    error={errors.phone}
                    className="pl-14"
                    {...register("phone")}
                  />
                  <span className="absolute bottom-[11px] left-4 text-gray-400 font-medium border-r border-glassBorder pr-2">
                    +91
                  </span>
                </div>

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password}
                  {...register("password")}
                />
                <div className="h-1.5 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-1/3 transition-all"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Make it strong!</p>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  isLoading={isLoading}
                >
                  Sign Up
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-blue-400 font-medium"
                >
                  Log in
                </Link>
              </p>
            </motion.div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
