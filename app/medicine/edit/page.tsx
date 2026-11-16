import type { Metadata } from "next";
import { Suspense } from "react";
import EditMedication from "@/components/EditMedication";
import { Loading } from "@/components/ui";

export const metadata: Metadata = { title: "Edit medicine · Medicine History" };

// Address: /medicine/edit/?id=001
export default function EditMedicinePage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditMedication />
    </Suspense>
  );
}
