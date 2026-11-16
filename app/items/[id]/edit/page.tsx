import { Suspense } from "react";
import EditMedication from "@/components/EditMedication";
import { BackLink, Loading } from "@/components/ui";

export default function EditItemPage({ params }: PageProps<"/items/[id]/edit">) {
  return (
    <Suspense fallback={<Loading />}>
      {params.then(({ id }) => {
        const decoded = decodeURIComponent(id);
        return (
          <>
            <BackLink href={`/items/${id}`}>Back to details</BackLink>
            <EditMedication id={decoded} />
          </>
        );
      })}
    </Suspense>
  );
}
