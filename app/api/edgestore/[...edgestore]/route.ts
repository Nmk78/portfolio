import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";

type Context = {
  userId: string;
  userName: string | null;
};

async function createContext({ req }: CreateContextOptions): Promise<Context> {
  // Use Clerk's getAuth to extract user information from the request
  const { userId } = getAuth(req);

  // Define user role and username
  let userRole: "admin" | "user" | null = null;
  let userName: string | null = null;

  if (userId) {
    // Fetch user details using Clerk's API
    const user = await clerkClient().users.getUser(userId);

    userName = user.username || null; // Adjust based on your user model
  }

  return {
    userId: userId || "", // Provide a default value if userId is undefined
    userName,
  };
}

const es = initEdgeStore.context<Context>().create();
/**
 * This is the main router for the Edge Store buckets.
 */
// const edgeStoreRouter = es.router({
//   publicFiles: es
//     .fileBucket()
//     .path((ctx) => [
//       {
//         cv: () => "naymyokhant_cv", // Static path as part of a function
//       },
//     ])
//     // .path(({}) => [
//     //   {
//     //     cv: () => {
//     //       return "naymyokhant_cv";
//     //     },
//     //   },
//     // ])
//     .metadata(({}) => ({
//       metadata: "naymyokhant_developer_cv",
//     })),

const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket()
    // e.g. /publicFiles/cv
    .path(({ ctx, input }) => [{ cv: ctx.userName }])
    // this metadata will be added to every file in this bucket
    .metadata(({ ctx, input }) => ({
      name: ctx.userName,
    })),


  publicImages: es.fileBucket({
    maxSize: 1024 * 1024 * 5, // 5MB
    accept: ["image/*"],
  }),
});
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});
export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
