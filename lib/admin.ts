import { auth } from "@clerk/nextjs/server";

const adminIds = [
  "user_3CDPJEymIqubvwRdpi4xeJRoS7o",
];

export const isAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
