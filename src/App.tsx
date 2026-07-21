import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Auditoria from "./pages/Auditoria.tsx";
import Generador from "./pages/Generador.tsx";
import BulkGenerator from "./pages/BulkGenerator.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import TerminosCondiciones from "./pages/TerminosCondiciones.tsx";
import Layout from "./components/Layout.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/auditoria" element={<Auditoria />} />
              <Route path="/generador" element={<Generador />} />
              <Route path="/bulk" element={<BulkGenerator />} />
              <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
