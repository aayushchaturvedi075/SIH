"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TimelineRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/workbench");
  }, [router]);

  return null;
}
