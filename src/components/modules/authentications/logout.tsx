"use client";
import { logout } from "../../../actions/logout";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interfaces/user.interfaces";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Logout = ({ user, token }: { user: IUser; token: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const hanldeSignOut = async () => {
    const toastId = "logout";
    setLoading(true);
    const response = await logout(token);

    if (response.success) {
      toast.success("Successfully logged out", { id: toastId });
      router.push("/login");
      setLoading(false);
      return;
    }
    toast.error("Logout failed", { id: toastId });
    setLoading(false);
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
          {!loading && `Add Blog`}
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
      )}
    </div>
  );
};

export default Logout;
