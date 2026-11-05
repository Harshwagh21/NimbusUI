import { EmptyState } from "@/components/ui/empty-state";

export default function TrashPage() {
  return (
    <EmptyState
      title="Trash is empty"
      description="Deleted items will rest here until you restore or remove them forever."
    />
  );
}
