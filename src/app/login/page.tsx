
import LoginForm from "./loginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp?.next ?? "/admin";

  return <LoginForm next={next} />;
}
