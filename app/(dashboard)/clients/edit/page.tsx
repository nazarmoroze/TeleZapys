import { Suspense } from "react";
import ClientEditClient from "@/components/dashboard/clients/ClientEditClient";

export default function ClientEditPage() {
  return (
    <Suspense fallback={null}>
      <ClientEditClient />
    </Suspense>
  );
}

