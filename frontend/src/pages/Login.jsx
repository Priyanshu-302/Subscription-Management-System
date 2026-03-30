import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { authAPI } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import HeroScene from "../components/3d/HeroScene";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setSessionToken } = useAuthStore();

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
      const isRemembered =
        localStorage.getItem("lastLoggedInEmail") === data.email;
      const skipOtp = isRemembered || data.rememberMe;

      const res = await authAPI.login({ ...data, skipOtp });
      if (res.data?.data?.sessionToken) {
        setSessionToken(res.data.data.sessionToken);
        toast.success("OTP sent to your email");
        navigate("/verify-otp");
      } else if (res.data?.data?.token) {
        // Direct login without OTP if applicable
        localStorage.setItem("lastLoggedInEmail", data.email);
        useAuthStore
          .getState()
          .setAuth(res.data.data.user, res.data.data.token);
        toast.success("Login Successful");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* 3D Scene / Visual Left Side */}
      <div className="hidden lg:flex w-1/2 relative bg-grid">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/90 z-10 pointer-events-none" />
        <div className="absolute top-12 left-12 z-20">
          <Link
            to="/"
            className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              S
            </span>
            SubManager
          </Link>
        </div>
      </div>

      {/* Form Right Side */}
      <div className="w-full lg:w-1/2 flex py-8 justify-center z-20 overflow-y-auto">
        <div className="w-full max-w-md m-auto px-4">
          <Card className="w-full p-8 bg-background/50 backdrop-blur-2xl border-glassBorder">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8 block lg:hidden">
                <Link
                  to="/"
                  className="text-2xl font-bold font-display text-white flex items-center gap-2"
                >
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    S
                  </span>
                  SubManager
                </Link>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400 mb-8">
                Enter your details to access your dashboard.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email}
                  {...register("email")}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password}
                  {...register("password")}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="rounded bg-glass border-glassBorder text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-blue-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Log In
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-blue-400 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
