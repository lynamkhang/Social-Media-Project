import { Plus } from "lucide-react";

interface CreateNewChatProps {
  onClick?: () => void;
}

const CreateNewChat = ({ onClick }: CreateNewChatProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Tạo cuộc trò chuyện mới"
      aria-label="Tạo cuộc trò chuyện mới"
      className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-blue-500 cursor-pointer"
    >
      <Plus className="size-5" />
    </button>
  );
};

export default CreateNewChat;