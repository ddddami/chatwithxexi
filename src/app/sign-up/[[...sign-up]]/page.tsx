import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100 flex justify-center items-center">
      <SignUp />;
    </div>
  );
}
