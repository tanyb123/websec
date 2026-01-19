"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type Role = "STUDENT" | "TEACHER";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    role: "STUDENT" as Role,
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength("weak");
    else if (strength <= 4) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) {
      newErrors.firstName = "Please enter first name";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Please enter last name";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Please enter email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.username) {
      newErrors.username = "Please enter username";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!formData.phone) {
      newErrors.phone = "Please enter phone number";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Please enter password";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms of service";
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
      console.log("Sign Up:", formData);
      alert("Sign up successful!");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Sign Up Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Fill in your information to create a new account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="STUDENT"
                      checked={formData.role === "STUDENT"}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === "STUDENT"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          formData.role === "STUDENT" ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                          <svg className={`w-6 h-6 ${formData.role === "STUDENT" ? "text-blue-600" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                        </div>
                        <span className={`font-medium ${formData.role === "STUDENT" ? "text-blue-600" : "text-gray-700"}`}>
                          Student
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="TEACHER"
                      checked={formData.role === "TEACHER"}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.role === "TEACHER"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          formData.role === "TEACHER" ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                          <svg className={`w-6 h-6 ${formData.role === "TEACHER" ? "text-blue-600" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <span className={`font-medium ${formData.role === "TEACHER" ? "text-blue-600" : "text-gray-700"}`}>
                          Teacher
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  error={errors.lastName}
                  required
                />
              </div>

              {/* Email */}
              <Input
                label="Email"
                type="email"
                placeholder="example@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              {/* Username & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  error={errors.username}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    checkPasswordStrength(e.target.value);
                  }}
                  error={errors.password}
                  helperText="At least 8 characters, including uppercase, lowercase and number"
                  required
                />
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1">
                      <div className={`flex-1 rounded ${passwordStrength === "weak" ? "bg-red-500" : passwordStrength === "medium" ? "bg-yellow-500" : "bg-green-500"}`}></div>
                      <div className={`flex-1 rounded ${passwordStrength === "medium" || passwordStrength === "strong" ? passwordStrength === "medium" ? "bg-yellow-500" : "bg-green-500" : "bg-gray-200"}`}></div>
                      <div className={`flex-1 rounded ${passwordStrength === "strong" ? "bg-green-500" : "bg-gray-200"}`}></div>
                    </div>
                    <p className={`text-xs mt-1 ${passwordStrength === "weak" ? "text-red-600" : passwordStrength === "medium" ? "text-yellow-600" : "text-green-600"}`}>
                      {passwordStrength === "weak" && "Weak password"}
                      {passwordStrength === "medium" && "Medium password"}
                      {passwordStrength === "strong" && "Strong password"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                required
              />

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in now
          </Link>
        </p>
      </div>
    </div>
  );
}
