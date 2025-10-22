"use client";

import { formSchema } from "@/app/util/schema";
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
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import FormInput from "../_components/form-input";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();
  const { getToken } = useLocalStorage();
  useEffect(() => {
    if (getToken("user")) {
      router.push("/dashboard");
    }
  }, []);
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json;
    },
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("user", data.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const form = useForm({
    defaultValues: {},
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Excallidraw</CardTitle>
        <CardDescription>Login to excallidraw</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="signup"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <FormInput
                      type="email"
                      placeholder="demo@gmail.com"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <FormInput
                      type="password"
                      placeholder=""
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="vertical">
          <Link
            href={"/login"}
            className="text-xs text-blue-600 hover:underline hover:text-blue-700 transition duration-200"
          >
            Don't have an account?
          </Link>
          <Button
            type="submit"
            form="signup"
            className="border-2 border-[#3a3b42] text-[#d7d7d8]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
