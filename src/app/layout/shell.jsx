import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import SearchBar from "../../modules/recipes/components/SearchBar";
import DailyPlanner from "../../modules/recipes/components/DailyPlanner.jsx";
import { usePlannerStore } from "../../modules/recipes/stores/planner.js";
import PlannerButton from "./components/PlannerButton.jsx";
import HamburgerMenu from "./components/HamburgerMenu.jsx";
import useClickOutside from "../../hooks/useClickOutside.js";
import { Toaster } from "react-hot-toast";

/**
 * Componente principal del layout de la aplicación (Shell).
 *
 * Este componente define la estructura visual persistente de la aplicación,
 * incluyendo el encabezado (header), el área de contenido principal donde se
 * renderizan las rutas anidadas, y el pie de página (footer).
 */
export default function Shell() {
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const fetchPlanner = usePlannerStore((state) => state.fetchPlanner);

  // Carga los datos del planificador del usuario una vez al montar el componente.
  useEffect(() => {
    fetchPlanner();
  }, [fetchPlanner]);

  // Hook para cerrar el dropdown del planificador al hacer clic fuera de él.
  const plannerRef = useClickOutside(() => {
    setIsPlannerOpen(false);
  });

  // Animación para la aparición del encabezado.
  const header = useSpring({ from: { opacity: 0, y: -8 }, to: { opacity: 1, y: 0 } });

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 text-slate-800">
      <Toaster position="top-center" />
      <animated.header
        style={header}
        className="sticky top-0 bg-emerald-50/80 backdrop-blur z-10"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <Link
            to="/home"
            className="font-semibold text-emerald-800"
          >
            Recetario Verde
          </Link>

          <div className="flex-1 max-w-lg">
            <SearchBar />
          </div>

          <nav className="text-sm flex items-center gap-4">
            {/* Dropdown del Planificador Diario */}
            <div className="relative" ref={plannerRef}>
              <PlannerButton onClick={() => setIsPlannerOpen((prev) => !prev)} />
              {isPlannerOpen && (
                <div className="absolute right-0 mt-2 w-lg max-w-lg rounded-2xl bg-white shadow-xl z-20">
                  <DailyPlanner />
                </div>
              )}
            </div>

            {/* Menú de hamburguesa para opciones secundarias. */}
            <HamburgerMenu />
          </nav>
        </div>
      </animated.header>
      {/* El componente Outlet de React Router renderiza aquí la ruta anidada actual. */}
      <main className="w-full px-4 py-6 flex-1">
        <Outlet />
      </main>
      <footer className="bg-emerald-100 text-emerald-800 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid gap-4 md:flex md:justify-between md:items-center">
          <div>
            <h3 className="font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-6">
              {/* Los iconos de redes sociales requieren la importación de Font Awesome. */}
              <a href="#" className="text-emerald-700 hover:text-emerald-600">
                <i className="fa-brands fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="text-emerald-700 hover:text-emerald-600">
                <i className="fa-brands fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-emerald-700 hover:text-emerald-600">
                <i className="fa-brands fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-emerald-700 hover:text-emerald-600">
                <i className="fa-brands fa-whatsapp fa-lg"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contáctanos</h3>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-phone fa-sm"></i>
              <span className="text-sm">+57 300 123 4567</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <i className="fa-brands fa-whatsapp fa-sm"></i>
              <span className="text-sm">+57 312 345 6789</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
