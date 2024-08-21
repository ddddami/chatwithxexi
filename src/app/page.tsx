import FileUpload from "@/components/fileupload";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = auth();
  const isAuth = Boolean(userId);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100 flex justify-center items-center">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center">
          <h1 className="mr-3 text-5xl font-semibold">Chat with XeXi</h1>
          {isAuth && (
            <div className="bg-gradient-to-r from-red-100 to-yellow-100 flex justify-center items-center p-2 rounded-full ml-5">
              <div className="bg-white flex justify-center items-center p-1 rounded-full">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          )}
        </div>

        <div className="flex mt-2">
          {isAuth && <Button>Go to Chats</Button>}
        </div>

        <p className="max-w-xl mt-2 text-lg text-slate-600">
          Join millions of students, researchers, and professionals to instantly
          answer questions and understand research with{" "}
          <span className="font-bold">XeXi AI</span>
        </p>

        <div className="w-full mt-4">
          {isAuth ? (
            <FileUpload />
          ) : (
            <Link href={"/sign-in"}>
              <Button>
                Log in to get Started!
                <LogInIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
