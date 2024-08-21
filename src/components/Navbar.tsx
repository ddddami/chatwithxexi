import React from "react";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

type Props = {
  isAuth: boolean;
};
const Navbar = async ({ isAuth }: Props) => {
  const { userId } = await auth();

  return (
    <nav className="flex justify-between px-10 py-5 bg-transparent">
      <h1 className="font-bold text-xl">renAI</h1>
      {userId ? (
        <p className="flex items-center gap-1">
          Welcome, <span className="font-semibold">{"Ahmad"}</span>{" "}
          <div className="flex justify-center items-center p-1 rounded-full">
            <UserButton afterSignOutUrl="/" />
          </div>
        </p>
      ) : (
        <Link href={"/sign-in"}>Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
