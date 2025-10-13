"use client";
import { logout } from "../../../actions/logout";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interfaces/user.interfaces";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Logout = ({ user, token }: { user: IUser; token: string }) => {
  const router = useRouter();

  const hanldeSignOut = async () => {
    const toastId = "logout";
    toast.loading("Logging out...", { id: toastId });

    const response = await logout(token);

    if (response.success) {
      toast.success("Successfully logged out", { id: toastId });
      router.push("/login");

      return;
    }
    toast.error("Logout failed", { id: toastId });
  };

  return (
    <div className="p-4 border-t border-gray-500">
      {user?.email && (
        <Button
          variant="destructive"
          className="w-full justify-start gap-2 cursor-pointer"
          onClick={() => hanldeSignOut()}
        >
          <LogOut className="h-4 w-4 cursor-pointer" />
          Logout
        </Button>
      )}
    </div>
  );
};

export default Logout;
