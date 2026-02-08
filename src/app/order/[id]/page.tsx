import { OrderDetailPage } from "@/features/account";

export default function Page({ params }: { params: { id: string } }) {
  return <OrderDetailPage orderId={params.id} />;
}
