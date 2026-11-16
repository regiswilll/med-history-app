import { Suspense } from "react";
import MedicationDetail from "@/components/MedicationDetail";
import { BackLink, Loading } from "@/components/ui";

export default function ItemPage({ params }: PageProps<"/items/[id]">) {
  return (
    <>
      <BackLink href="/">All medicines</BackLink>
      <Suspense fallback={<Loading />}>
        {params.then(({ id }) => (
          <MedicationDetail id={decodeURIComponent(id)} />
        ))}
      </Suspense>
    </>
  );
}
