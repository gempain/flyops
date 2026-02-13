import { WooCustomer } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-customer";
import { woocommerce } from "@/scripts/woo-to-stripe/woo-commerce/client";

const pageSize = 50;

interface CustomerPage {
  customers: WooCustomer[];
  currentPage: number;
  totalPages: number;
}

export async function* paginateCustomers(): AsyncGenerator<CustomerPage> {
  let page = 1;
  let totalPages = 1;

  do {
    // https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-customers
    const response = await woocommerce.get("/customers", {
      params: {
        role: "all",
        page: page,
        per_page: pageSize,
      },
    });

    const totalPagesHeader: string = (response.headers["x-wp-totalpages"] ?? "1") as string;
    totalPages = parseInt(totalPagesHeader, 10);

    console.log(`Fetched customers page ${page} out of ${totalPages}`);

    yield {
      customers: response.data,
      currentPage: page,
      totalPages,
    };

    page++;
  } while (page <= totalPages);
}
