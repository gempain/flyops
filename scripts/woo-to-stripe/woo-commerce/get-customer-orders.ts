import { WooOrder } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-order";
import { woocommerce } from "@/scripts/woo-to-stripe/woo-commerce/client";

export async function getCustomerOrders(customerId?: number): Promise<WooOrder[]> {
  const orders: WooOrder[] = [];
  let page = 1;
  let isLast = false;

  do {
    // https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-orders
    const response = await woocommerce.get("/orders", {
      params: {
        customer: customerId,
        page: page,
        per_page: 50,
      },
    });
    orders.push(...response.data);
    const totalPagesHeader: string = (response.headers["x-wp-totalpages"] ?? "0") as string;
    const totalPages = parseInt(totalPagesHeader, 10);
    isLast = totalPages === 0 || page === totalPages;
    page++;
    console.log(`Fetched orders page ${page - 1} out of ${totalPages} for customer ${customerId}`);
  } while (!isLast);

  return orders;
}
