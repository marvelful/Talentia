import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";

type UserRole = "student" | "company" | "mentor" | "university";

const roles = [
  { id: "student", label: "Student", icon: GraduationCap, description: "Showcase talent & find opportunities" },
  { id: "company", label: "Company", icon: Building2, description: "Hire creative talent" },
  { id: "mentor", label: "Mentor", icon: User, description: "Guide the next generation" },
  { id: "university", label: "University", icon: Building2, description: "Manage student programs" },
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("name") || "").trim();

    try {
      let response;

      if (mode === "signup") {
        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ") || "";

        const roleMap: Record<UserRole, string> = {
          student: "STUDENT",
          company: "COMPANY",
          mentor: "MENTOR",
          university: "UNIVERSITY_ADMIN",
        };

        response = await api.auth.register({
          firstName: firstName || "",
          lastName: lastName || "",
          email,
          password,
          role: roleMap[selectedRole],
        });
      } else {
        response = await api.auth.login({ email, password });
      }

      // Persist auth state (simple localStorage for now)
      if (response?.accessToken && response?.user) {
        localStorage.setItem("talentia_token", response.accessToken);
        localStorage.setItem("talentia_user", JSON.stringify(response.user));

        const role = response.user.role as string;
        let target = "/dashboard";

        if (role === "COMPANY") target = "/company-dashboard";
        else if (role === "MENTOR") target = "/mentor-dashboard";
        else if (role === "UNIVERSITY_ADMIN") target = "/university-dashboard";
        else if (role === "SUPER_ADMIN") target = "/admin-dashboard";

        navigate(target);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-coral flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TALENTIA</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "signin" 
                ? "Sign in to continue to your dashboard" 
                : "Join 50,000+ students discovering their potential"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {mode === "signup" && step === 1 ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Label className="text-foreground">Select your role</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id as UserRole)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selectedRole === role.id
                          ? "border-coral bg-coral/5"
                          : "border-border hover:border-coral/50"
                      }`}
                    >
                      <role.icon className={`w-6 h-6 mb-2 ${
                        selectedRole === role.id ? "text-coral" : "text-muted-foreground"
                      }`} />
                      <div className="font-medium text-foreground">{role.label}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </button>
                  ))}
                </div>
                <Button 
                  variant="coral" 
                  size="lg" 
                  className="w-full mt-6"
                  onClick={() => setStep(2)}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="auth-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
                onSubmit={handleSubmit}
              >
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        id="name" 
                        name="name"
                        type="text" 
                        placeholder="Enter your full name"
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="you@university.edu"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="password" 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {mode === "signin" && (
                  <div className="flex items-center justify-end">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-coral hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button variant="coral" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting
                    ? mode === "signin"
                      ? "Signing in..."
                      : "Creating account..."
                    : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                {mode === "signup" && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back to role selection
                  </button>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" className="h-12">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" size="lg" className="h-12">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>

          {/* Toggle Mode */}
          <p className="text-center mt-8 text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setStep(1);
              }}
              className="text-coral font-semibold hover:underline"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('../../unifac pic/230225-africa-019WEB.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-indigo-900/60" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6">
            Discover & Develop Your
            <br />
            <span className="text-coral">Creative Talents</span>
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-md">
            Join thousands of university students who are already building their 
            portfolios and connecting with opportunities.
          </p>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              "AI-powered talent assessment",
              "Professional portfolio builder",
              "Access to paid opportunities",
              "Industry mentorship programs",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-coral" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
