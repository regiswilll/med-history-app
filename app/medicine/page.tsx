import type { Metadata } from "next";
import { Suspense } from "react";
import MedicationDetail from "@/components/MedicationDetail";
import { BackLink, Loading } from "@/components/ui";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Medicine · Medicine History" };

// Address: /medicine/?id=001
export default function MedicinePage() {
  return (
    <>
      <BackLink href={routes.home}>All medicines</BackLink>
      {/* The ?id= part is only known in the browser, so it renders inside Suspense. */}
      <Suspense fallback={<Loading />}>
        <MedicationDetail />
      </Suspense>
    </>
  );
}
