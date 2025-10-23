"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import FormInput from "../_components/form-input";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { signupAction } from "../_actions/signup";

const LoginPage = () => {
  const router = useRouter();
  const [state, action, pending] = useActionState(signupAction, undefined);
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Excallidraw</CardTitle>
        <CardDescription>Signup on excallidraw</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} id="signup">
          <FieldGroup>
            <Field orientation="vertical">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FormInput
                  type="email"
                  placeholder="demo@gmail.com"
                  id="email"
                  name="email"
                />
                {state?.errors?.email && (
                  <FieldError
                    errors={state.errors.email.map((msg: string) => ({
                      message: msg,
                    }))}
                  />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FormInput
                  type="password"
                  placeholder=""
                  id="password"
                  name="password"
                />
                {state?.errors?.password && (
                  <FieldError
                    errors={state.errors.password.map((msg: string) => ({
                      message: msg,
                    }))}
                  />
                )}
              </Field>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="vertical">
          <Link
            href={"/signup"}
            className="text-xs text-blue-600 hover:underline hover:text-blue-700 transition duration-200"
          >
            Already have an account?
          </Link>
          <Button
            type="submit"
            form="signup"
            className="border-2 border-[#3a3b42] text-[#d7d7d8]"
            disabled={pending}
          >
            {pending ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
