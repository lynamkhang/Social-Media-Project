import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signUpSchema = z
  .object({
    fullname: z.string().min(1, "Họ và tên không được để trống"),
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"], // set error on confirmPassword field
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signUp} = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { fullname, username, email, password } = data;

    // TODO: Call API to register user
    await signUp(username, password, email, fullname);

    navigate("/signin");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <a href="/" className="mx-auto block w-20 h-19 text-center">
                <img src="logo.png" alt="Logo" />
              </a>
              <h1 className="text-2xl font bold text-center">
                Tạo tài khoản UITSocial
              </h1>
              <p className="text-muted-foreground text-balance text-center">
                Chào mừng bạn đến với UITSocial!
              </p>
              {/* Full name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm block">
                  Họ và tên
                </Label>
                <Input type="text" id="fullname" {...register("fullname")} />

                {errors.fullname && (
                  <p className="text-sm text-destructive">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
              {/*  Username */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm block">
                  Tên đăng nhập
                </Label>
                <Input type="text" id="username" {...register("username")} />

                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm block">
                  Email
                </Label>
                <Input type="email" id="email" {...register("email")} />

                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm block">
                    Mật khẩu
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    {...register("password")}
                  />

                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm block">
                    Xác nhận mật khẩu
                  </Label>
                  <Input
                    type="password"
                    id="confirm-password"
                    {...register("confirmPassword")}
                  />

                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Create button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Tạo tài khoản
              </Button>
            </div>
            <div className="text-sm text-center mt-4">
              Đã có tài khoản?{" "}
              <a href="/signin" className="underline underline-offset-4">
                Đăng nhập
              </a>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="uit.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs test-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
