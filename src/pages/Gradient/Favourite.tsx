import { FaTrash, FaEdit } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  id: number;
  type: string;
  colors: { color: string; stop: number }[];
  angle?: number;
  setType: (type: string) => void;
  setColors: (colors: { color: string; stop: number }[]) => void;
  setAngle: (angle: number) => void;
  setFavourites: (favourites: Props[]) => void;
}

const Favourite = ({
  id,
  type,
  colors,
  angle,
  setType,
  setAngle,
  setColors,
  setFavourites,
}: Props) => {
  const { toast } = useToast();
  const gradientGenerator = () => {
    if (type === "linear") {
      return linearGradient();
    }
    return radialGradient();
  };

  const linearGradient = () => {
    return `linear-gradient(${angle || 90}deg, ${[...colors]
      .sort((a, b) => a.stop - b.stop)
      .map((color) => `${color.color} ${color.stop}%`)
      .join(", ")})`;
  };

  const radialGradient = () => {
    return `radial-gradient(circle, ${[...colors]
      .sort((a, b) => a.stop - b.stop)
      .map((color) => `${color.color} ${color.stop}%`)
      .join(", ")})`;
  };

  const deleteFavorite = () => {
    const newFav = JSON.parse(
      localStorage.getItem("favouritesGradients") ?? "[]"
    )?.filter((favorite: Props) => favorite.id !== id);

    setFavourites(newFav);

    localStorage.setItem("favouritesGradients", JSON.stringify(newFav));
    toast({
      title: "Success",
      description: "The gradient has removed from your favourites",
    });
  };

  return (
    <div className="max-w-full max-h-40 rounded-md mt-4 overflow-hidden relative">
      <div
        className="w-full h-40 rounded-md relative hover:scale-125 duration-150 cursor-pointer"
        style={{
          background: gradientGenerator(),
        }}
      ></div>
      <div className="absolute bottom-0 bg-white w-full h-8 flex overflow-hidden rounded-b-md hover:h-10 duration-150">
        <div
          className="flex-grow flex justify-center items-center bg-primary text-primary-foreground duration-200 cursor-pointer hover:bg-primary/90"
          onClick={() => {
            navigator.clipboard.writeText(
              `background: ${gradientGenerator()};`
            );
            toast({
              title: "Success",
              description: "The gradient has been copied to your clipboard",
            });
          }}
        >
          <p className="flex gap-x-2 mb-0 items-center justify-center">
            Copy <MdContentCopy />
          </p>
        </div>
        <div
          className="bg-secondary flex justify-center items-center p-3 duration-200 cursor-pointer hover:bg-secondary/90"
          onClick={() => {
            setColors(colors);
            setType(type);
            setAngle(angle || 90);
          }}
        >
          <FaEdit />
        </div>
        <div
          className="bg-destructive flex justify-center items-center p-3 duration-200 cursor-pointer hover:bg-destructive/80"
          onClick={deleteFavorite}
        >
          <FaTrash />
        </div>
      </div>
    </div>
  );
};

export default Favourite;
