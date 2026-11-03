import { Card, CardContent } from "@/components/ui/card";
import ManageResume from "../profile/ManageResume";

const ResumeCard = ({ token }: { token: string }) => (
    <Card className="w-full overflow-hidden rounded-xl">
        <CardContent className="space-y-5 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                    Resume Management
                </h2>
                <p className="text-sm text-muted-foreground">
                    Upload or replace your current resume PDF.
                </p>
            </div>

            {/* Resume Uploader */}
            <div className="w-full">
                <ManageResume token={token} />
            </div>
        </CardContent>
    </Card>
);


export default ResumeCard