import Signout from "@/components/auth/Signout";
import { useAuthStore } from "@/stores/useAuthStore";

const HomePage = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      {user?.username}
      <Signout />
    </div>
  );
};

export default HomePage;
