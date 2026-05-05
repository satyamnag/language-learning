import { auth } from "@clerk/nextjs/server";

const adminIds = [
  "user_3CDPJEymIqubvwRdpi4xeJRoS7o",
  "user_3CHCitPyvb8eCBpdTiPloA3bLII",
];

export const isAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
