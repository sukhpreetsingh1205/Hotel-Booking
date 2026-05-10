import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Auth = () => {
  const { login, register, user, navigate } = useAppContext();
  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await login({ email, password });
        if (res.success) {
          toast.success("Logged in");
          navigate("/");
        } else {
          toast.error(res.message || "Login failed");
        }
      } else {
        const res = await register({ username, email, password });
        if (res.success) {
          toast.success("Account created");
          navigate("/");
        } else {
          toast.error(res.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-xl mx-auto">
        <Title
          title={mode === "login" ? "Welcome Back" : "Create Account"}
          subTitle="Sign in to manage bookings or list your hotel."
        />

        <div className="mt-10 bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.12)] rounded-xl p-6 md:p-8">
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg border transition-all ${
                mode === "login"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-200"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg border transition-all ${
                mode === "register"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-200"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full border border-gray-200 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full border border-gray-200 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              disabled={loading}
              className="bg-primary hover:bg-primary-dull transition-all text-white px-6 py-3 rounded cursor-pointer mt-2 disabled:opacity-70"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;

