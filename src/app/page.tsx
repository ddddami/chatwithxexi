import FileUpload from "@/components/fileupload";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const { userId } = auth();
  const isAuth = Boolean(userId);

  return (
    <div className="bg-gradient-to-r from-rose-100 to-teal-100">
      <Navbar isAuth={isAuth} />
      <div className="w-screen min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with renAI</h1>
          </div>

          <div className="flex mt-2">
            {isAuth && <Button>Go to Chats</Button>}
          </div>

          {/* <p className="max-w-xl mt-2 text-lg text-slate-600">
            Join millions of students, researchers, and professionals to
            instantly answer questions and understand research with{" "}
            <span className="font-bold">renai AI</span>
          </p> */}
          <p className="p-8 text-lg text-slate-600">
            A powerful application that enables you to interact with your PDFs,
            <span className="block"></span>
            more like you have your frinedly lecturer explaining tha tough
            course to you😉
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
    </div>
  );
}
