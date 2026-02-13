import { ReactNode } from "react";
import { PageContainer } from "@/components/PageContainer";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <PageContainer className="bg-gray-50">
      <div className="container mx-auto">{children}</div>
    </PageContainer>
  );
}
