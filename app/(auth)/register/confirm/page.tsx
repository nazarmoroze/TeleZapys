import { Suspense } from "react";
import ConfirmEmailClient from "@/components/auth/ConfirmEmailClient";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailClient />
    </Suspense>
  );
}

