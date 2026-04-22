import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const success = await login(email, password);
      setLoading(false);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] shadow-xl rounded-2xl">
        <CardContent className="p-6">

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-white text-2xl">
              🧠
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-center">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Sign in to your PsyNex account
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm">Email</label>
            <Input
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white"
          >
            {loading ? " Logging in..." : "Login"}
          </Button>

          {/* SIGNUP */}
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}