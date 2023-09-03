import { auth } from "@clerk/nextjs";

import { mongodb } from "@/lib/db";

export const currentProfile = async () => {
    const { userId } = auth();

    if (!userId) {
        return null;
    }

    const profile = await mongodb.profile.findUnique({
        where: {
            userId
        }
    });

    return profile;
}