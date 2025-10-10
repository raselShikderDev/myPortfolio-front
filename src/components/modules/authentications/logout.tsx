"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Logout = () => {
  const session = useSession();
  if (session.status !== "authenticated" || !session.data.user.email) return null;

  return (
    <div className="p-4 border-t border-gray-500">
      {session.status === "authenticated" && session.data.user?.email && (
        <Button
          variant="destructive"
          className="w-full justify-start gap-2 cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="h-4 w-4 cursor-pointer" />
          Logout
        </Button>
      )}
    </div>
  );
};

export default Logout;
