import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { supabase } from "../lib/supabaseClient";
import { Button, Input, Card, CardBody, CardHeader, Tabs, Tab } from "@heroui/react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-pink-100/60">
      <Card className="backdrop-blur-xl bg-white/50 border border-white/30 shadow-2xl rounded-3xl w-full max-w-md p-8 transition-all duration-300">
        <CardHeader className="mb-4">
          <Tabs aria-label="Auth Tabs" className="">
            <Tab key="login" title="Login">
              <CardBody className="p-0">
                <AuthForm mode="login" />
              </CardBody>
            </Tab>
            <Tab key="register" title="Register">
              <CardBody className="p-0">
                <AuthForm mode="register" />
              </CardBody>
            </Tab>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}

function AuthForm({ mode }: { mode: "login" | "register" }) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form method="post" className="space-y-6">
      <input type="hidden" name="mode" value={mode} />
      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Email</label>
        <Input
          name="email"
          type="email"
          required
          className="w-full rounded-xl bg-white/40 border border-white/30 shadow-inner backdrop-blur placeholder-gray-400 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
          placeholder="you@email.com"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Password</label>
        <Input
          name="password"
          type="password"
          required
          className="w-full rounded-xl bg-white/40 border border-white/30 shadow-inner backdrop-blur placeholder-gray-400 px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-200"
          placeholder="••••••••"
        />
      </div>
      {actionData?.error && (
        <div className="text-red-500 text-sm font-medium rounded-lg bg-white/60 border border-red-200 px-3 py-2 shadow-sm mb-2">
          {actionData.error}
        </div>
      )}
      <Button
        type="submit"
        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-400/70 via-purple-400/60 to-pink-400/70 text-white font-semibold shadow-lg hover:from-blue-500/80 hover:to-pink-500/80 hover:shadow-xl active:scale-95 transition-all duration-150 backdrop-blur border border-white/40"
        disabled={isSubmitting}
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