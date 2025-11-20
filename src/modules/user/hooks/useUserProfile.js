import { useState, useEffect } from 'react'
import { useAuthStore } from '../../auth/stores/auth.js'
import api from '../../../utils/api'
import toast from 'react-hot-toast'

/**
 * Hook personalizado para gestionar la lógica del perfil de usuario.
 *
 * Encapsula el estado del formulario, el modo de edición y la comunicación
 * con la API para actualizar los datos del usuario. También se sincroniza
 * con el `useAuthStore` para mantener los datos globales actualizados.
 *
 * @returns {object} El estado y los manejadores necesarios para el componente del perfil.
 */
export function useUserProfile() {
  const { profile, login } = useAuthStore()
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [pantry, setPantry] = useState([])
  const [fieldErrors, setFieldErrors] = useState({});

  // Define las reglas de validación para los campos del perfil.
  const validate = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = 'El nombre es obligatorio.';
    if (!data.calorieGoal) {
      errors.calorieGoal = 'La meta calórica es obligatoria.';
    } else if (Number(data.calorieGoal) <= 0) {
      errors.calorieGoal = 'La meta debe ser un número positivo.';
    }
    if (!data.phone?.trim()) errors.phone = 'El teléfono es obligatorio.';
    if (!data.address?.trim()) errors.address = 'La dirección es obligatoria.';
    if (!data.idNumber?.trim()) errors.idNumber = 'La identificación es obligatoria.';
    return errors;
  };

  // Sincroniza el estado del formulario con el perfil del store y carga la despensa del usuario.
  useEffect(() => {
    if (profile) {
      setFormData(profile)
      const fetchPantry = async () => {
        try {
          const response = await api.get('/users/me/pantry');
          setPantry(response.data);
        } catch (error) {
          console.error("Error al cargar la despensa:", error);
        }
      };
      fetchPantry();
    }
  }, [profile])

  const handleEditField = (fieldName) => {
    setEditingField(fieldName);
    setSaveError(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    if (profile) {
      setFormData(profile); // Restaura los datos del perfil original al cancelar.
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Valida el campo modificado en tiempo real para feedback instantáneo.
    const validationErrors = validate(updatedFormData);
    setFieldErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);

    // Ejecuta una validación final antes de enviar los datos al servidor.
    const validationErrors = validate(formData);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Detiene el envío si hay errores de validación.
    }

    setIsSaving(true);
    
    try {
      const response = await api.put('/users/me', formData);
      const updatedUser = response.data;
      
      // Actualiza el perfil del usuario en el store de autenticación global.
      login(updatedUser);
      toast.success('Perfil actualizado con éxito.');

      setEditingField(null);
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      const message =
        error.response?.data?.message || 'No se pudo guardar el perfil.';
      setSaveError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePantry = async (newPantry) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      // Llama a la API para reemplazar la despensa del usuario en el backend.
      await api.put('/users/me/pantry', { ingredients: newPantry });
      // Si tiene éxito, actualiza el estado local para reflejar el cambio en la UI.
      setPantry(newPantry);
      toast.success('Despensa actualizada con éxito.');
    } catch (error) {
      console.error("Error al actualizar la despensa:", error);
      const message = "No se pudo guardar la despensa. Inténtalo de nuevo.";
      setSaveError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user: profile,
    pantry,
    editingField,
    formData,
    isSaving,
    saveError,
    fieldErrors,
    handleEditField,
    handleCancel,
    handleChange,
    handleSubmit,
    updatePantry,
  }
}