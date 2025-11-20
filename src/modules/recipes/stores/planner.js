import { create } from 'zustand';
import api from '../../../utils/api';
import toast from 'react-hot-toast';



/**
 * Store de Zustand para gestionar el estado del planificador diario.
 * Este store se sincroniza con el backend para persistir los datos.
 */
export const usePlannerStore = create((set, get) => ({
  // --- ESTADO ---
  planId: null,      // El ID del DailyPlan de hoy.
  planEntries: [],   // La lista de PlanEntry (recetas añadidas).
  isLoading: true,   // True mientras se cargan los datos iniciales.
  error: null,       // Almacena mensajes de error de la API.

  // --- ACCIONES ---

  /**
   * Carga el planificador del día actual desde el backend.
   * Si no existe un plan para hoy, la API crea uno nuevo.
   */
  fetchPlanner: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/planner/today');
      const plan = response.data;
      set({
        planId: plan.id,
        planEntries: plan.entries || [],
        isLoading: false,
      });
    } catch (err) {
      console.error('Error al cargar el planificador:', err);
      set({ isLoading: false, error: 'No se pudo cargar el planificador.' });
    }
  },

  /**
   * Añade una receta al plan diario actual haciendo una llamada a la API.
   * @param {object} recipe - El objeto completo de la receta a añadir.
   */
  addRecipe: async (recipe) => {
    const { planId } = get();
    if (!planId) {
      toast.error('No se puede añadir recetas, plan no cargado.');
      console.error('No se puede añadir la receta: falta el ID del plan.');
      return;
    }

    try {
      const response = await api.post('/planner/entries', {
        recipeId: recipe.id,
        planId,
      });
      const newEntry = response.data;
      set((state) => ({
        planEntries: [...state.planEntries, newEntry],
      }));
      toast.success(`"${recipe.title}" añadida al plan.`);
    } catch (err) {
      console.error('Error al añadir la receta:', err);
      const message =
        err.response?.data?.message || 'No se pudo añadir la receta.';
      toast.error(message);
    }
  },

  /**
   * Elimina una entrada específica del plan diario.
   * @param {number} planEntryId - El ID único de la entrada del plan (no el de la receta).
   */
  removeRecipe: async (planEntryId) => {
    try {
      await api.delete(`/planner/entries/${planEntryId}`);
      set((state) => ({
        planEntries: state.planEntries.filter(
          (entry) => entry.id !== planEntryId
        ),
      }));
      toast.success('Receta eliminada del plan.');
    } catch (err) {
      console.error('Error al eliminar la receta:', err);
      const message =
        err.response?.data?.message || 'No se pudo eliminar la receta.';
      toast.error(message);
    }
  },
}));

