import { SupportTicketDetailPage } from "@/features/account";

export default function Page({ params }: { params: { id: string } }) {
  return <SupportTicketDetailPage ticketId={params.id} />;
}
