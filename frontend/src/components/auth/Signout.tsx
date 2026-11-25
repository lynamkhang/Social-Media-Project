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
      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      Đăng xuất
    </Button>
  );
};

export default Signout;
