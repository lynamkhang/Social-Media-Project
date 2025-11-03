import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <a href="/" 
                className="mx-auto block w-20 h-19 text-center">
                  <img
                    src="logo.png"
                    alt="Logo"
                  />
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
                <Input
                  type="text"
                  id="fullname"
                />
              </div>
              {/*  Username */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm block">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                />
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm block">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                />
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm block">
                    Xác nhận mật khẩu
                  </Label>
                  <Input
                    type="password"
                    id="confirm-password"
                  />
                </div>
              </div>    
              {/* Create button */}
              <Button
                type="submit"
                className="w-full"
              >
                Tạo tài khoản
              </Button>
            </div>
            <div className="text-sm text-center mt-4">
              Đã có tài khoản? {" "}
              <a href="/signin" className="underline underline-offset-4">Đăng nhập</a>
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
  )
}
