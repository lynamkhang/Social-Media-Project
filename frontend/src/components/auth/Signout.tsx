import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

const Signout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleSignout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handleSignout}
      variant="ghost"
      className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut className="size-4" />
      Đăng xuất
    </Button>
  );
};

export default Signout;
