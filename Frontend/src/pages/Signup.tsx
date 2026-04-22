import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Brain, Eye, EyeOff } from "lucide-react";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!firstName) return setError("First name is required");
        if (!lastName) return setError("Last name is required");
        if (!email) return setError("Email is required");
        if (!/\S+@\S+\.\S+/.test(email)) return setError("Invalid email format");
        if (password.length < 6) return setError("Password must be at least 6 characters");

        setLoading(true);
        const ok = await signup(firstName, lastName, email, password);
        setLoading(false);

        if (ok) {
            toast.success("Account created successfully! Please Login.");
            navigate("/login");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/10 px-4 py-12">
            <div className="w-full max-w-md space-y-8">

                {/* Header */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-calm shadow-lg">
                        <Brain className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                        <p className="text-sm text-muted-foreground">
                            Start your wellness journey today
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur p-8 shadow-lg"
                >
                    {error && (
                        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-medium">
                            {error}
                        </div>
                    )}

                    {/* First Name */}
                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="John"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Doe"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6 space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPw ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg gradient-calm px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                    >
                        {loading && (
                            <Spinner size={18} className="text-primary-foreground" />
                        )}
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    {/* Login link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;