import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { supabase } from "../lib/supabaseClient";
import { Button, Input, Card, CardBody, Tabs, Tab } from "@heroui/react";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const mode = formData.get("mode");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password required." };
  }

  if (mode === "login") {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return redirect("/");
  } else if (mode === "register") {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return redirect("/");
  }
  return { error: "Invalid mode." };
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-8">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-sm text-center mb-8 tracking-tight select-none">
        Tourney <span className="bg-gradient-to-r from-blue-400/80 via-purple-400/80 to-pink-400/80 bg-clip-text text-transparent">Go</span>
      </h1>
      {/* Auth Card */}
      <div className="flex flex-col items-center w-full">
          {/* Tabs at the top - HeroUI pattern */}
          <Tabs aria-label="Options">
            <Tab key="login" title="Login">
              <Card className="min-w-[32rem]">  
                <CardBody>
                  <AuthForm mode="login" />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="register" title="Register">
              <Card className="min-w-[32rem]">
                <CardBody>
                <AuthForm mode="register" />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
    </div>
  );
}

function AuthForm({ mode }: { mode: "login" | "register" }) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form method="post" className="space-y-8">
      <input type="hidden" name="mode" value={mode} />
      <div className="space-y-3">
        <label>Email</label>
        <Input
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="you@email.com"
        />
      </div>
      <div className="space-y-3">
        <label>Password</label>
        <Input
          name="password"
          type="password"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="••••••••"
        />
      </div>
      {actionData?.error && (
        <div className="text-danger text-base font-medium rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 shadow-md mb-2 text-center backdrop-blur">
          {actionData.error}
        </div>
      )}
      <Button
        type="submit"
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-400/80 via-purple-400/70 to-pink-400/80 text-white font-bold text-lg shadow-xl hover:from-blue-500/90 hover:to-pink-500/90 hover:shadow-2xl active:scale-98 transition-all duration-200 backdrop-blur-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
        disabled={isSubmitting}
        style={{ boxShadow: "0 6px 32px 0 rgba(31,38,135,0.18)" }}
      >
        {isSubmitting
          ? mode === "login"
            ? "Logging in..."
            : "Registering..."
          : mode === "login"
          ? "Login"
          : "Register"}
      </Button>
    </Form>
  );
}