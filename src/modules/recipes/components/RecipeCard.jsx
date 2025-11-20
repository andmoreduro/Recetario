import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePlannerStore } from "../stores/planner";
import { Button } from "../../../components/Button";

/**
 * Tarjeta de receta con animación de voltear.
 *
 * Muestra la receta en dos caras: la frontal presenta una imagen, nombre,
 * descripción breve y datos nutricionales; al hacer clic se rota para
 * mostrar la lista de pasos de preparación. Utiliza propiedades optimizadas
 * (`opacity` y `transform`) para lograr una animación suave. You understand.
 */
export default function RecipeCard({ recipe }) {
  const [flipped, setFlipped] = useState(false);
  const addRecipe = usePlannerStore((state) => state.addRecipe);

  const handleAddClick = (e) => {
    addRecipe(recipe);
  };

  const { transform, opacity } = useSpring({
    transform: `perspective(1000px) rotateY(${flipped ? 180 : 0}deg)`,
    opacity: flipped ? 0 : 1,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  const { opacity: backOpacity } = useSpring({
    opacity: flipped ? 1 : 0,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <div
      className="relative w-full h-80 select-none"
      aria-live="polite"
    >
      {/* Cara frontal */}
      <animated.div
        id="recipe-front"
        style={{ opacity, transform, backfaceVisibility: 'hidden' }}
        className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-white shadow"
        aria-hidden={flipped}
      >
        <Button
          variant="primary"
          size="icon"
          onClick={handleAddClick}
          className="absolute top-2 right-2 z-10 rounded-full text-lg font-bold transition-transform transform hover:scale-110"
          title="Añadir al plan diario"
        >
          +
        </Button>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-32 object-cover rounded-t-2xl"
          />
        )}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="text-lg font-semibold text-emerald-800">
              {recipe.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {recipe.description}
            </p>
          </div>
          <div className="mt-2 flex gap-2 text-xs text-slate-500">
            <span>{recipe.kcal} kcal</span>
            <span>{recipe.time}</span>
            <span>{recipe.level}</span>
          </div>
          <Button
            variant="link"
            onClick={() => setFlipped(true)}
            className="mt-2 text-sm self-start p-0"
            aria-controls="recipe-back"
          >
            Ver instrucciones
          </Button>
        </div>
      </animated.div>
      {/* Cara trasera */}
      <animated.div
        id="recipe-back"
        style={{
          opacity: backOpacity,
          transform: transform.to((t) => `${t} rotateY(180deg)`),
          backfaceVisibility: 'hidden',
        }}
        className="absolute inset-0 flex flex-col overflow-auto rounded-2xl bg-emerald-50 p-4 shadow"
        aria-hidden={!flipped}
      >
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-emerald-700">Instrucciones</h4>
          <Button
            variant="link"
            onClick={() => setFlipped(false)}
            className="text-sm p-0"
            aria-controls="recipe-front"
          >
            Volver
          </Button>
        </div>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
          {recipe.steps.map((step) => (
            <li key={step.id}>{step.description}</li>
          ))}
        </ol>
      </animated.div>
    </div>
  );
}
