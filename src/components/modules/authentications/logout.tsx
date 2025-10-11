"use client";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interfaces/user.interfaces";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Logout = ({ user, token }: { user: IUser; token: string }) => {
  const router = useRouter();

  const hanldeSignOut = async ()=> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
      }
    );
    

    const responseData: {
      success: boolean;
      token?: string;
      message?: string;
    } = await response.json();

    if (!response.ok || !responseData.success) {
      toast.error(responseData.message || "Logout failed");
      return;
    }

    const toastId = toast.loading("Logging out...");
    toast.success("Successfully logged out", { id: toastId });
    router.push("/login");
  };

  return (
    <div className="p-4 border-t border-gray-500">
      {user.email && (
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
