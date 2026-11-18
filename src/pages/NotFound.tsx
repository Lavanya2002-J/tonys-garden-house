import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";

export default function NotFound() {
  return (
    <PageLayout>
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-4xl text-garden-dark">Page not found</h1>
        <p className="text-muted">Sophie looked everywhere, but this page isn't here.</p>
        <Link to="/" className="btn-garden">Back to home</Link>
      </div>
    </PageLayout>
  );
}
