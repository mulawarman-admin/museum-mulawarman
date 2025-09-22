import LoginForm from "./loginForm";

export default async function LoginPage({
  searchParams,
}: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;               // Next.js 15: mungkin Promise
  const next = sp?.next ?? "/admin";
  const error = sp?.error === "1";
  return <LoginForm next={next}  />;
}
