"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = "Please enter username";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Please enter password";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Sign In:", formData);
      alert("Sign in successful!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Sign In Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your account information</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <Input
                label="Username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                error={errors.username}
                required
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                required
              />

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
