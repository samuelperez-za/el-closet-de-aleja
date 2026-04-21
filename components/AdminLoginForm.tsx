"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.email("Ingresa un correo válido."),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginValues) {
    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setMessage(data.error || "No fue posible iniciar sesión.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    });
  }

  return (
    <Card className="rounded-[2rem] p-7 md:p-8">
      <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label>Correo administrador</Label>
          <Input {...form.register("email")} type="email" placeholder="admin@elclosetdealeja.com" />
          <p className="mt-2 text-xs text-rose-600">{form.formState.errors.email?.message}</p>
        </div>

        <div>
          <Label>Contraseña</Label>
          <Input {...form.register("password")} type="password" placeholder="••••••••" />
          <p className="mt-2 text-xs text-rose-600">{form.formState.errors.password?.message}</p>
        </div>

        {message ? <p className="text-sm text-primary-strong">{message}</p> : null}

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Ingresar al panel
        </Button>
      </form>
    </Card>
  );
}
