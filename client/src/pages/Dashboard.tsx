import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { useMemo, useState, type FormEvent } from "react";
import type {
  Transaction,
  TransactionFormData,
  TransactionType,
} from "../types/transactions";
import {
  addTransactionApi,
  deleteTransactionApi,
  getTransactionsApi,
  updateTransactionApi,
} from "../api/transactions";
import { getErrorMessage } from "../utils/helpers";
import { logoutApi } from "../api/auth";
import styled from "styled-components";
import {
  Eyebrow,
  Field,
  FormHeader,
  InlineError,
  PrimaryButton,
  TwoColumn,
} from "../components/StyledComponents";
import { QUERY_KEYS } from "../lib/queryKeys";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const blankTransaction: TransactionFormData = {
  title: "",
  amount: 0,
  type: "Expense",
  date: new Date().toISOString().slice(0, 10),
  category: "",
  description: "",
};

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, signout } = useAuth();
  const [form, setForm] = useState<TransactionFormData>(blankTransaction);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const transactionsQuery = useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS,
    queryFn: getTransactionsApi,
  });

  const transactions = useMemo(
    () => transactionsQuery.data ?? [],
    [transactionsQuery.data],
  );

  const summary = useMemo(() => {
    return transactions.reduce(
      (totals, transaction) => {
        const amount = Number(transaction.amount) || 0;

        if (transaction.type === "Income") {
          totals.income += amount;
        } else {
          totals.expense += amount;
        }

        totals.balance = totals.income - totals.expense;
        return totals;
      },
      { income: 0, expense: 0, balance: 0 },
    );
  }, [transactions]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (editingId) {
        return updateTransactionApi({ id: editingId, data: payload });
      }

      return addTransactionApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
      setForm(blankTransaction);
      setEditingId(null);
      setErrorMessage("");
    },
    onError: (error) => setErrorMessage(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS }),
    onError: (error) => setErrorMessage(getErrorMessage(error)),
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSettled: () => signout(() => navigate("/signin", { replace: true })),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    saveMutation.mutate();
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction._id);
    setForm({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date.slice(0, 10),
      category: transaction.category,
      description: transaction.description,
    });
  };

  const transactionColumns: TableColumnsType<Transaction> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 108,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (_title: string, transaction) => (
        <TransactionTitle>
          <strong>{transaction.title}</strong>
          <small>{transaction.description}</small>
        </TransactionTitle>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 80,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: 108,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 90,
      render: (_, transaction) => (
        <ActionGroup>
          <Tooltip title="Edit">
            <EditOutlined
              onClick={() => startEdit(transaction)}
              style={{ cursor: "pointer", fontSize: 16 }}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <DeleteOutlined
              onClick={() => deleteMutation.mutate(transaction._id)}
              style={{
                cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                fontSize: 16,
                color: "red",
                opacity: deleteMutation.isPending ? 0.5 : 1,
              }}
            />
          </Tooltip>
        </ActionGroup>
      ),
    },
  ];

  return (
    <DashboardPage>
      <TopBar>
        <div>
          <Eyebrow>Expense Manager</Eyebrow>
          <h1>Transactions</h1>
          <p>
            {user?.name
              ? `Signed in as ${user.name}`
              : "Your personal money dashboard"}
          </p>
        </div>
        <GhostButton type="button" onClick={() => logoutMutation.mutate()}>
          Logout
        </GhostButton>
      </TopBar>

      <SummaryGrid>
        <MetricCard>
          <span>Balance</span>
          <strong>{formatCurrency(summary.balance)}</strong>
        </MetricCard>
        <MetricCard>
          <span>Income</span>
          <strong>{formatCurrency(summary.income)}</strong>
        </MetricCard>
        <MetricCard>
          <span>Expenses</span>
          <strong>{formatCurrency(summary.expense)}</strong>
        </MetricCard>
      </SummaryGrid>

      <Workspace>
        <TransactionForm onSubmit={handleSubmit}>
          <FormHeader>
            <div>
              <Eyebrow>{editingId ? "Edit" : "Add"}</Eyebrow>
              <h2>{editingId ? "Update transaction" : "New transaction"}</h2>
            </div>
            {editingId && (
              <GhostButton
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(blankTransaction);
                  setErrorMessage("");
                }}
              >
                Cancel
              </GhostButton>
            )}
          </FormHeader>

          <Field>
            <span>Title</span>
            <input
              required
              maxLength={20}
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
            />
          </Field>

          <TwoColumn>
            <Field>
              <span>Amount</span>
              <input
                required
                min="0"
                step="0.01"
                type="number"
                value={form.amount}
                onChange={(event) =>
                  setForm({ ...form, amount: Number(event.target.value) })
                }
              />
            </Field>
            <Field>
              <span>Date</span>
              <input
                required
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm({ ...form, date: event.target.value })
                }
              />
            </Field>
          </TwoColumn>

          <TwoColumn>
            <Field>
              <span>Type</span>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm({
                    ...form,
                    type: event.target.value as TransactionType,
                  })
                }
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </Field>
            <Field>
              <span>Category</span>
              <input
                required
                maxLength={20}
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              />
            </Field>
          </TwoColumn>

          <Field>
            <span>Description</span>
            <textarea
              maxLength={50}
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </Field>

          {errorMessage && <InlineError>{errorMessage}</InlineError>}

          <PrimaryButton type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending
              ? "Saving..."
              : editingId
                ? "Save changes"
                : "Add transaction"}
          </PrimaryButton>
        </TransactionForm>

        <TransactionsPanel>
          <PanelHeader>
            <div>
              <Eyebrow>Overview</Eyebrow>
              <h2>All transactions</h2>
            </div>
            <CountBadge>{transactions.length}</CountBadge>
          </PanelHeader>

          <TransactionsTable
            columns={transactionColumns}
            dataSource={transactions}
            loading={transactionsQuery.isLoading}
            locale={{ emptyText: "No transactions yet." }}
            pagination={false}
            rowKey="_id"
            scroll={{ x: 930 }}
          />
        </TransactionsPanel>
      </Workspace>
    </DashboardPage>
  );
}

export default Dashboard;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const DashboardPage = styled.main`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing["4xl"]};
  background: ${({ theme }) => theme.colors.page};
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 20px;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing["3xl"]};
  margin: 0 auto 28px;
  max-width: ${({ theme }) => theme.sizes.pageMax};

  h1,
  p {
    margin: 0;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 3.4rem);
  }

  p {
    color: ${({ theme }) => theme.colors.mutedText};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const SummaryGrid = styled.section`
  max-width: ${({ theme }) => theme.sizes.pageMax};
  margin: 0 auto ${({ theme }) => theme.spacing["3xl"]};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};

  span {
    color: ${({ theme }) => theme.colors.mutedText};
    font-size: 0.9rem;
  }

  strong {
    font-size: clamp(1.5rem, 3vw, 2.3rem);
  }
`;

const Workspace = styled.section`
  max-width: ${({ theme }) => theme.sizes.pageMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${({ theme }) => theme.sizes.formColumn} minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing["2xl"]};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TransactionForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`;

const TransactionsPanel = styled.section`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`;

const PanelHeader = styled(FormHeader)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const GhostButton = styled.button`
  min-height: 38px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.brand};
  font: inherit;
  font-weight: 800;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const CountBadge = styled.span`
  min-width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.brand};
  font-weight: 900;
`;

const TransactionsTable = styled(Table<Transaction>)`
  .ant-table {
    background: ${({ theme }) => theme.colors.surface};
  }

  .ant-table-thead > tr > th {
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  .ant-table-tbody > tr > td {
    vertical-align: middle;
  }

  .ant-table-cell-fix-right {
    box-shadow: ${({ theme }) => theme.shadows.fixedColumn};
  }
`;

const TransactionTitle = styled.span`
  display: grid;
  gap: 2px;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }

  small {
    color: ${({ theme }) => theme.colors.mutedText};
  }
`;

const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: ${({ theme }) => theme.spacing.sm};
`;
