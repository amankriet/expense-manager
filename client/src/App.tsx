import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { AxiosError } from "axios";
import { AuthProvider } from "./context/auth-context";
import { useAuth } from "./hooks/use-auth";
import { logoutApi, signInApi, signUpApi } from "./api/auth";
import {
  addTransactionApi,
  deleteTransactionApi,
  getTransactionsApi,
  updateTransactionApi,
} from "./api/transactions";
import type { SignInSignUpResponse, SignUpRequest } from "./types/auth";
import type { Transaction, TransactionFormData, TransactionType } from "./types/transactions";

const blankTransaction: TransactionFormData = {
  title: "",
  amount: 0,
  type: "Expense",
  date: new Date().toISOString().slice(0, 10),
  category: "",
  description: "",
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<AuthScreen mode="signin" />} />
          <Route path="/signup" element={<AuthScreen mode="signup" />} />
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Dashboard />
              </ProtectedPage>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function ProtectedPage({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signin" replace />;
}

function AuthScreen({ mode }: { mode: "signin" | "signup" }) {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const isSignup = mode === "signup";
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<SignUpRequest>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    password: "",
    role: "user",
  });

  const authMutation = useMutation<SignInSignUpResponse, Error>({
    mutationFn: () => {
      if (isSignup) {
        return signUpApi(form);
      }

      return signInApi({
        email: form.email,
        password: form.password,
      });
    },
    onSuccess: (data) => {
      signin(data.tokens.accessToken, data.user, () => navigate("/", { replace: true }));
    },
    onError: (error) => setErrorMessage(getErrorMessage(error)),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    authMutation.mutate();
  };

  return (
    <AuthPage>
      <BrandPanel>
        <LogoMark>EM</LogoMark>
        <AuthTitle>{isSignup ? "Create your account" : "Welcome back"}</AuthTitle>
        <AuthCopy>
          Track income and expenses with a focused dashboard built for quick daily updates.
        </AuthCopy>
      </BrandPanel>

      <AuthCard onSubmit={handleSubmit}>
        <FormHeader>
          <div>
            <Eyebrow>{isSignup ? "Sign up" : "Sign in"}</Eyebrow>
            <h1>{isSignup ? "Start managing money" : "Open your dashboard"}</h1>
          </div>
        </FormHeader>

        {isSignup && (
          <TwoColumn>
            <Field>
              <span>First name</span>
              <input
                required
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
              />
            </Field>
            <Field>
              <span>Last name</span>
              <input
                required
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
              />
            </Field>
          </TwoColumn>
        )}

        <Field>
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </Field>

        {isSignup && (
          <TwoColumn>
            <Field>
              <span>Mobile</span>
              <input
                required
                inputMode="numeric"
                value={form.mobile}
                onChange={(event) => setForm({ ...form, mobile: event.target.value })}
              />
            </Field>
            <Field>
              <span>Date of birth</span>
              <input
                required
                type="date"
                value={form.dob}
                onChange={(event) => setForm({ ...form, dob: event.target.value })}
              />
            </Field>
          </TwoColumn>
        )}

        <Field>
          <span>Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </Field>

        {errorMessage && <InlineError>{errorMessage}</InlineError>}

        <PrimaryButton type="submit" disabled={authMutation.isPending}>
          {authMutation.isPending ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
        </PrimaryButton>

        <SwitchText>
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            onClick={() => navigate(isSignup ? "/signin" : "/signup", { replace: true })}
          >
            {isSignup ? "Sign in" : "Create account"}
          </button>
        </SwitchText>
      </AuthCard>
    </AuthPage>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, signout } = useAuth();
  const [form, setForm] = useState<TransactionFormData>(blankTransaction);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
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
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setForm(blankTransaction);
      setEditingId(null);
      setErrorMessage("");
    },
    onError: (error) => setErrorMessage(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
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

  return (
    <DashboardPage>
      <TopBar>
        <div>
          <Eyebrow>Expense Manager</Eyebrow>
          <h1>Transactions</h1>
          <p>{user?.name ? `Signed in as ${user.name}` : "Your personal money dashboard"}</p>
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
              onChange={(event) => setForm({ ...form, title: event.target.value })}
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
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </Field>
          </TwoColumn>

          <TwoColumn>
            <Field>
              <span>Type</span>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value as TransactionType })
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
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
            </Field>
          </TwoColumn>

          <Field>
            <span>Description</span>
            <textarea
              required
              maxLength={50}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
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

          {transactionsQuery.isLoading ? (
            <EmptyState>Loading transactions...</EmptyState>
          ) : transactions.length === 0 ? (
            <EmptyState>No transactions yet.</EmptyState>
          ) : (
            <TableWrap>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{formatDate(transaction.date)}</td>
                      <td>
                        <strong>{transaction.title}</strong>
                        <small>{transaction.description}</small>
                      </td>
                      <td>{transaction.category}</td>
                      <td>{transaction.type}</td>
                      <td>{formatCurrency(transaction.amount)}</td>
                      <td>
                        <ActionGroup>
                          <GhostButton type="button" onClick={() => startEdit(transaction)}>
                            Edit
                          </GhostButton>
                          <DangerButton
                            type="button"
                            onClick={() => deleteMutation.mutate(transaction._id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </DangerButton>
                        </ActionGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </TransactionsPanel>
      </Workspace>
    </DashboardPage>
  );
}

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

const AuthPage = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr);
  background: #f6f3ee;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const BrandPanel = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  padding: 48px;
  background: #26362f;
  color: #fffdf7;

  @media (max-width: 860px) {
    padding: 32px 24px;
  }
`;

const LogoMark = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #d5f365;
  color: #1f2d27;
  font-weight: 900;
`;

const AuthTitle = styled.h2`
  max-width: 480px;
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 1;
`;

const AuthCopy = styled.p`
  max-width: 420px;
  margin: 0;
  color: #d7ded2;
  font-size: 1.05rem;
`;

const AuthCard = styled.form`
  align-self: center;
  justify-self: center;
  width: min(440px, calc(100% - 40px));
  display: grid;
  gap: 18px;
  padding: 32px;
  border: 1px solid #e4ded2;
  border-radius: 8px;
  background: #fffdf8;
  box-shadow: 0 24px 80px rgba(45, 38, 25, 0.12);

  @media (max-width: 560px) {
    padding: 24px;
    margin: 24px 0;
  }
`;

const DashboardPage = styled.main`
  min-height: 100vh;
  padding: 32px;
  background: #f6f3ee;
  color: #202721;

  @media (max-width: 860px) {
    padding: 20px;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 0 auto 28px;
  max-width: 1220px;

  h1,
  p {
    margin: 0;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 3.4rem);
  }

  p {
    color: #657169;
  }

  @media (max-width: 860px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const SummaryGrid = styled.section`
  max-width: 1220px;
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.article`
  display: grid;
  gap: 8px;
  padding: 22px;
  border: 1px solid #e2dccf;
  border-radius: 8px;
  background: #fffdf8;

  span {
    color: #657169;
    font-size: 0.9rem;
  }

  strong {
    font-size: clamp(1.5rem, 3vw, 2.3rem);
  }
`;

const Workspace = styled.section`
  max-width: 1220px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 22px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const TransactionForm = styled.form`
  display: grid;
  gap: 16px;
  padding: 22px;
  border: 1px solid #e2dccf;
  border-radius: 8px;
  background: #fffdf8;
`;

const TransactionsPanel = styled.section`
  min-width: 0;
  padding: 22px;
  border: 1px solid #e2dccf;
  border-radius: 8px;
  background: #fffdf8;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;

  h1,
  h2 {
    margin: 4px 0 0;
  }
`;

const PanelHeader = styled(FormHeader)`
  margin-bottom: 18px;
`;

const Eyebrow = styled.span`
  display: block;
  color: #637063;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 7px;
  color: #4c574f;
  font-size: 0.9rem;
  font-weight: 700;

  input,
  select,
  textarea {
    width: 100%;
    min-height: 44px;
    box-sizing: border-box;
    border: 1px solid #d7d0c1;
    border-radius: 8px;
    background: #fff;
    color: #202721;
    font: inherit;
    font-weight: 500;
    padding: 10px 12px;
    outline: none;
  }

  textarea {
    min-height: 86px;
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: #26362f;
    box-shadow: 0 0 0 3px rgba(38, 54, 47, 0.12);
  }
`;

const PrimaryButton = styled.button`
  min-height: 46px;
  border: 0;
  border-radius: 8px;
  background: #26362f;
  color: #fffdf8;
  font: inherit;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const GhostButton = styled.button`
  min-height: 38px;
  border: 1px solid #d7d0c1;
  border-radius: 8px;
  background: #fffdf8;
  color: #26362f;
  font: inherit;
  font-weight: 800;
  padding: 8px 12px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const DangerButton = styled(GhostButton)`
  color: #9a2d26;
  border-color: #e7c4bd;
`;

const SwitchText = styled.p`
  margin: 0;
  text-align: center;
  color: #647069;

  button {
    border: 0;
    background: none;
    color: #26362f;
    font: inherit;
    font-weight: 900;
    cursor: pointer;
  }
`;

const InlineError = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fff1ee;
  color: #9a2d26;
  font-weight: 700;
`;

const CountBadge = styled.span`
  min-width: 34px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #edf4d1;
  color: #26362f;
  font-weight: 900;
`;

const TableWrap = styled.div`
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 760px;
  }

  th,
  td {
    padding: 14px 12px;
    border-bottom: 1px solid #ebe5d9;
    text-align: left;
    vertical-align: middle;
  }

  th {
    color: #667066;
    font-size: 0.78rem;
    text-transform: uppercase;
  }

  td strong,
  td small {
    display: block;
  }

  td small {
    color: #6b756e;
    margin-top: 2px;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const EmptyState = styled.div`
  min-height: 180px;
  display: grid;
  place-items: center;
  color: #647069;
  border: 1px dashed #d7d0c1;
  border-radius: 8px;
`;

export default App;
