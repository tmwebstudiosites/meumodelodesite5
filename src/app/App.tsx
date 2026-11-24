import { AnimatePresence, MotionConfig } from "motion/react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ContactFab } from "@/layout/ContactFab";
import { Footer } from "@/layout/Footer";
import { Header } from "@/layout/Header";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { PageTransition } from "@/shared/ui/PageTransition";
import { RouteProgress, ScrollProgress } from "@/shared/ui/Progress";
import { PageSkeleton } from "./PageSkeleton";

// Code splitting por rota: cada página só é baixada quando visitada.
const HomePage = lazy(() => import("@/pages/HomePage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const DressPage = lazy(() => import("@/pages/DressPage"));
const BookingPage = lazy(() => import("@/pages/BookingPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function AnimatedRoutes() {
  const location = useLocation();
  const page = (el: React.ReactNode) => <PageTransition>{el}</PageTransition>;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={page(<HomePage />)} />
        <Route path="/vestidos" element={page(<CatalogPage />)} />
        <Route path="/vestidos/:slug" element={page(<DressPage />)} />
        <Route path="/agendar" element={page(<BookingPage />)} />
        <Route path="*" element={page(<NotFoundPage />)} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <BrowserRouter>
          <a className="skip-link" href="#conteudo">
            Pular para o conteúdo
          </a>
          <ScrollProgress />
          <RouteProgress />
          <Header />
          <Suspense fallback={<PageSkeleton />}>
            <AnimatedRoutes />
          </Suspense>
          <Footer />
          <ContactFab />
        </BrowserRouter>
      </ErrorBoundary>
    </MotionConfig>
  );
}
