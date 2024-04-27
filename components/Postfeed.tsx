import { Post } from "@/firebase/logic.posts";
import PostComponent from "./PostComponent";
const Postfeed = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="space-y-2 pb-20">
      {posts?.map((post: Post) => (
        <div className="" key={post.id}>
          <PostComponent post={post} />
        </div>
      ))}
    </div>
  );
};

export default Postfeed;
