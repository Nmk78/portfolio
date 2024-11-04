import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const ENV = process.env.ENV;

  return (
    <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
      {ENV === "development" ? <SignUp /> : ""}
    </div>
  );
}
