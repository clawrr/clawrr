import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

import { SITE_CONFIG } from "@/config/site";
import { signIn } from "@/infrastructure/auth";
import { Button } from "@/presentation/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/ui/card";
import { Input } from "@/presentation/ui/input";
import { Label } from "@/presentation/ui/label";
import { Separator } from "@/presentation/ui/separator";

const isDev = process.env.NODE_ENV === "development";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{SITE_CONFIG.name}</CardTitle>
          <CardDescription>Sign in to manage your AI agents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDev && (
            <>
              <form
                action={async (formData) => {
                  "use server";
                  await signIn("credentials", {
                    email: formData.get("email"),
                    redirectTo: "/",
                  });
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Dev Login (local only)</Label>
                  <Input
                    defaultValue="dev@example.com"
                    id="email"
                    name="email"
                    placeholder="dev@example.com"
                    required
                    type="email"
                  />
                </div>
                <Button className="w-full" type="submit">
                  Sign in as Dev User
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <Button className="w-full" type="submit" variant="outline">
              <IconBrandGithub className="mr-2 size-4" />
              Continue with GitHub
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button className="w-full" type="submit" variant="outline">
              <IconBrandGoogle className="mr-2 size-4" />
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
