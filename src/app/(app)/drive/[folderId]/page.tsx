"use client";

import { use } from "react";
import { DriveBrowser } from "@/components/drive/drive-browser";

type Props = {
  params: Promise<{ folderId: string }>;
};

export default function NestedDrivePage({ params }: Props) {
  const { folderId } = use(params);
  return <DriveBrowser parentId={folderId} />;
}
