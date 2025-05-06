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
  try {
    // Use Clerk's getAuth to extract user information from the request
    const { userId } = getAuth(req);

    let userName: string | null = null;

    if (userId) {
      // Fetch user details using Clerk's API
      const user = await clerkClient().users.getUser(userId);

      // Ensure userName is fetched from Clerk, leave it as null if not found
      userName = user.username || null;
    }

    // Ensure both userId and userName are valid before proceeding
    if (!userId || !userName) {
      throw new Error(
        "Authentication error: Missing userId or username.(This is seeing because edgestore try to initialize at first regardless of user signed or not)"
      );
    }

    return {
      userId,
      userName,
    };
  } catch (error) {
    // Gracefully handle the error and return a response, preventing server crash
    console.error("Context creation failed:", error);
    throw new Error("Unauthorized access or missing credentials."); // or customize response
  }
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket()
    // e.g. /publicFiles/cv
    .path(({ ctx }) => [{ cv: ctx.userName }])
    // this metadata will be added to every file in this bucket
    .metadata(({ ctx }) => ({
      name: ctx.userName,
    })),
  // .beforeDelete(({ ctx, fileInfo }) => {
  //   console.log("beforeDelete", ctx, fileInfo);
  //   return true; // allow delete
  // })

  publicImages: es
    .fileBucket({
      maxSize: 1024 * 1024 * 5, // 5MB
      accept: ["image/*"],
    })
    .beforeUpload(({ ctx, input, fileInfo }) => {
      console.log("beforeUpload", ctx, input, fileInfo);
      return true; // allow upload
    })
    .beforeDelete(({ ctx, fileInfo }) => {
      console.log("beforeDelete", ctx, fileInfo);
      return true; // allow delete
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
