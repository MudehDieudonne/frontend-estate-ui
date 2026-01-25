import { FeedLayout } from "@/components/FeedLayout";
import { Services } from "@/components/Services";

export const ServicesPage = () => {
    return (
        <FeedLayout>
            <div className="max-w-4xl mx-auto">
                <Services />
            </div>
        </FeedLayout>
    );
};
