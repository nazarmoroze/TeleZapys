import { Suspense } from "react";
import ClientDetailsClient from "@/components/dashboard/clients/ClientDetailsClient";
import ClientDetailsSkeleton from "@/components/dashboard/clients/ClientDetailsSkeleton";

export default function ClientDetailsPage() {
  return (
    <Suspense fallback={<ClientDetailsSkeleton />}>
      <ClientDetailsClient />
    </Suspense>
  );
}
