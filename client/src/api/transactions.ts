import { apiClient } from "./http";
import type {
  Transaction,
  TransactionFormData,
  TransactionsResponse,
  TransactionResponse,
} from "../types/transactions";

export async function getTransactionsApi() {
  const res = await apiClient.get<TransactionsResponse>("/expenses/all", {
    params: { limit: 100, page: 1 },
  });

  return res.data.expenses ?? [];
}

export async function addTransactionApi(data: TransactionFormData) {
  const res = await apiClient.post<TransactionResponse>("/expenses", data);
  return res.data.expense;
}

export async function updateTransactionApi({
  id,
  data,
}: {
  id: string;
  data: TransactionFormData;
}) {
  const res = await apiClient.patch<TransactionResponse>("/expenses", data, {
    params: { id },
  });

  return res.data.expense;
}

export async function deleteTransactionApi(id: string) {
  const res = await apiClient.delete<TransactionResponse>("/expenses", {
    params: { id },
  });

  return res.data.expense as Transaction;
}
