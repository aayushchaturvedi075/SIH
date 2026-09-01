"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CrossComplaintRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/network");
  }, [router]);

  return null;
}
