import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  BriefcaseIcon,
  HomeIcon,
  MessagesSquare,
  MessagesSquareIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
function Header() {
  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      <Image
        className="rounded-lg"
        src="https://links.papareact.com/b3z"
        width={40}
        height={40}
        alt="logo"
      />
      <form
        action=""
        className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96"
      >
        <SearchIcon className="h-4 text-gray-600" />
        <input
          type="text"
          placeholder="search"
          className="bg-transparent  outline-none flex-1"
        />
      </form>
      <div className="flex items-center space-x-4 px-6">
        <Link href="" className="icon">
          <HomeIcon className="h-5" />
          <p>Home</p>
        </Link>
        <Link href="" className="icon hidden md:flex">
          <UsersIcon className="h-5" />
          <p>Network</p>
        </Link>
        <Link href="" className="icon hidden md:flex">
          <BriefcaseIcon className="h-5" />
          <p>Jobs</p>
        </Link>
        <Link href="" className="icon hidden md:flex">
          <MessagesSquare className="h-5" />
          <p>Message</p>
        </Link>
      </div>

      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Button asChild variant="secondary">
          <SignInButton />
        </Button>
      </SignedOut>
    </div>
  );
}

export default Header;
