import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { mongodb } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { string } from "zod";

interface InviteCodePageProps {
    params: {
        inviteCode: string,
        id: string,



    };
};

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const existingServer = await mongodb.server.findFirst({
        where: {
            inviteCode: params.inviteCode,


            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await mongodb.server.update({
        where: {
            inviteCode: params.inviteCode, 
            id: params.id
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
}

export default InviteCodePage;