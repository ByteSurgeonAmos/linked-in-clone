import Postfeed from "@/components/Postfeed";
import PostForm from "@/components/PostForm";
import { UserInformation } from "@/components/UserInformation";
import { SignedIn } from "@clerk/nextjs";
import { getPosts } from "@/firebase/logic.posts";
import Widget from "@/components/Widget";
const Home = async () => {
  const posts = await getPosts();

  return (
    <div className="grid grid-cols-8 mt-5 sm:px-4 overflow-x-clip">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation posts={posts} />
      </section>
      <section className="col-span-full md:col-span-4 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        <SignedIn>
          <PostForm />
        </SignedIn>
        <hr className="w-full border-gray-200 my-5" />
        <Postfeed posts={posts} />
      </section>
      <section className="hidden xl:inline justify-center col-span-2 w-[400px]">
        <Widget />
      </section>
    </div>
  );
};

export default Home;
