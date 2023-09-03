import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { mongodb } from "@/lib/db";

export const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);

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