"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Edit, ExternalLink, MoreVertical, Search } from "lucide-react";
import { type Customer, CustomersQuery, UpdateCustomerRole } from "@/lib/schemas/customer-role-schema";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useQueryClient } from "@tanstack/react-query";
import { CustomerRoleEnum } from "@/lib/schemas/customer-metadata-schema";
import { PageSizeSelector } from "@/components/PageSizeSelector";
import { useUpdateUrlParams } from "@/lib/hooks/useUpdateUrlParams";
import { AuthGuard } from "@/components/AuthGuard";
import { getTranslatedError } from "@/lib/api/translate-error";
import { useAdminCustomers, useUpdateCustomerRole } from "@/lib/api/hooks";
import { EditCustomerRoleDialog } from "@/components/admin/EditCustomerRoleDialog";
import { AdminLayout } from "@/components/admin/AdminLayout";

function Page() {
  const searchParams = useSearchParams();
  const t = useTranslations("admin.customers");
  const tError = useTranslations();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState<CustomersQuery>({
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "25"),
    search: searchParams.get("search") || "",
    role: (searchParams.get("role") as CustomerRoleEnum) || undefined,
  });
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const updateUrlParams = useUpdateUrlParams<CustomersQuery>({ defaultLimit: 25 });

  useEffect(() => {
    updateUrlParams(filters);
  }, [filters, updateUrlParams]);

  const adminCustomers = useAdminCustomers(filters);

  const updateCustomerRoleMutation = useUpdateCustomerRole({
    onSuccess: () => {
      toast.success(t("updateSuccess"));
      setEditingCustomer(null);
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    },
    onError: (error) => {
      const errorMessage = getTranslatedError(error, (key, params) => tError(key, params));
      toast.error(errorMessage);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: searchInput.trim(),
    }));
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const onSubmit = (data: UpdateCustomerRole) => {
    if (!editingCustomer) {
      return;
    }

    updateCustomerRoleMutation.mutate({
      customerId: editingCustomer.id,
      data: { role: data.role },
    });
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
            <Button asChild>
              <a
                href="https://dashboard.stripe.com/customers"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t("viewAllInStripe")}
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="search"
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                }}
              />
            </div>
            <Button type="button" onClick={(e) => handleSearch(e)}>
              <Search className="w-4 h-4 mr-2" />
              {t("search")}
            </Button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-2">
              <Label htmlFor="role-filter" className="whitespace-nowrap">
                {t("filterByRole")}
              </Label>
              <Select
                value={filters.role}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    page: 1,
                    role: value as CustomerRoleEnum,
                  }))
                }
              >
                <SelectTrigger id="role-filter" className="w-[150px]">
                  <SelectValue placeholder={t("allRoles")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revendeur">{t("roles.revendeur")}</SelectItem>
                  <SelectItem value="particulier">{t("roles.particulier")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <PageSizeSelector
              value={filters.limit}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  page: 1,
                  limit: value,
                }))
              }
              label={t("pageSize")}
              options={[10, 25, 50, 100]}
            />
          </div>

          {(filters.search || filters.role) && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchInput("");
                  setFilters((prev) => ({
                    ...prev,
                    page: 1,
                    search: "",
                    role: "",
                  }));
                }}
              >
                {t("clearAllFilters")}
              </Button>
            </div>
          )}

          {adminCustomers.isLoading && <LoadingState />}

          {adminCustomers.isError && <ErrorState message={t("errorLoading")} />}

          {adminCustomers.data && adminCustomers.data.customers.length === 0 && (
            <div className="text-center py-12 text-gray-500">{t("noCustomers")}</div>
          )}

          {adminCustomers.data && adminCustomers.data.customers.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t("customer")}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t("email")}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t("role")}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t("createdAt")}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminCustomers.data.customers.map((customer: Customer) => (
                      <tr key={customer.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{customer.name || "-"}</td>
                        <td className="px-4 py-3 text-sm">{customer.email || "-"}</td>
                        <td className="px-4 py-3 text-sm">
                          {customer.role ? (
                            <Badge variant="outline">{t(`roles.${customer.role}`)}</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">{new Date(customer.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("editRole")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(`https://dashboard.stripe.com/customers/${customer.id}`, "_blank")
                                }
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                {t("viewInStripe")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {t("showing", {
                    from: (adminCustomers.data.page - 1) * adminCustomers.data.limit + 1,
                    to: Math.min(adminCustomers.data.page * adminCustomers.data.limit, adminCustomers.data.total),
                    total: adminCustomers.data.total,
                  })}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={adminCustomers.data.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t("previous")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={adminCustomers.data.page >= adminCustomers.data.totalPages}
                  >
                    {t("next")}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <EditCustomerRoleDialog
        customer={editingCustomer}
        isOpen={!!editingCustomer}
        isPending={updateCustomerRoleMutation.isPending}
        onClose={() => setEditingCustomer(null)}
        onSubmit={onSubmit}
      />
    </AdminLayout>
  );
}

export default function AdminCustomersPage() {
  return <AuthGuard requiredRole="admin">{() => <Page />}</AuthGuard>;
}
