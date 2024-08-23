import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import uniqolor from 'uniqolor';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import Linear from "./Linear";
import Radial from "./Radial";
import { MdContentCopy } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import Favourite from "./Favourite";

interface Color {
  color: string;
  stop: number;
}

interface Favourite {
  id: number;
  type: string;
  colors: Color[];
  angle?: number;
}

const Gradient = () => {
  const { toast } = useToast();
  const [colors, setColors] = useState<Color[]>([
    { color: uniqolor.random().color, stop: 0 },
    { color: uniqolor.random().color, stop: 100 },
  ]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState("linear");

  const gradientGenerator = () => {
    if (type === "linear") {
      return linearGradient();
    }
    return radialGradient();
  };

  const linearGradient = () => {
    return `linear-gradient(${angle}deg, ${[...colors]
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

  const getNewStop = () => {
    if (colors.length === 1) return colors[0].stop === 1000 ? 0 : 100;

    return (
      (colors[colors.length - 1].stop + colors[colors.length - 2].stop) / 2
    );
  };

  const getFavourites = (): Favourite[] => {
    if (localStorage.getItem("favouritesGradients")) {
      return (
        JSON.parse(localStorage.getItem("favouritesGradients") || "") || []
      );
    }
    return [];
  };

  const [favourites, setFavourites] = useState<Favourite[]>(getFavourites());

  return (
    <div className="flex flex-col md:flex-row p-12 gap-x-8">
      <div className="grow">
        <h1 className="text-3xl font-bold">Gradient generator</h1>
        <p className="text-lg text-gray-500">
          Pick your colors to generate your gradient colors
        </p>
        <div
          className="w-full h-64 rounded-md mt-4"
          style={{
            background: gradientGenerator(),
          }}
        ></div>
        <Card className="my-4 p-6">
          <div className="inline md:flex justify-between items-center">
            <code>background: {gradientGenerator()};</code>
            <MdContentCopy
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  `background: ${gradientGenerator()};`
                );
                toast({
                  title: "Success",
                  description: "The gradient has been copied to your clipboard",
                });
              }}
            />
          </div>
        </Card>

        <div className="hidden md:block">
          <h2 className="text-2xl font-bold">Favourites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12">
            {favourites.map((favourite, index) => (
              <Favourite
                key={index}
                {...favourite}
                setFavourites={setFavourites}
                setAngle={setAngle}
                setColors={setColors}
                setType={setType}
              />
            ))}
          </div>
        </div>
      </div>
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Gradient generator</CardTitle>
          <CardDescription>
            Pick your colors to generate your gradient colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={type} onValueChange={setType}>
            <TabsList>
              <TabsTrigger value="linear">Linear</TabsTrigger>
              <TabsTrigger value="radial">Radial</TabsTrigger>
            </TabsList>
            <TabsContent value="linear">
              <Linear
                angle={angle}
                colors={colors}
                selectedColor={selectedColor}
                setAngle={setAngle}
                setColors={setColors}
                setSelectedColor={setSelectedColor}
              />
            </TabsContent>
            <TabsContent value="radial">
              <Radial />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between gap-x-2">
          <div className="flex gap-x-2">
            <Button
              variant="outline"
              onClick={() =>
                setColors([
                  ...colors,
                  { color: uniqolor.random().color, stop: getNewStop() },
                ])
              }
            >
              Add color
            </Button>
            <Button
              className="flex gap-x-2"
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
              Copy
              <MdContentCopy className="hidden md:block" />
            </Button>
          </div>

          <Button
            className="flex gap-x-2 bg-pink-700 hover:bg-pink-800 text-white"
            onClick={() => {
              const newFavourites = [
                ...favourites,
                {
                  type,
                  colors,
                  angle: type === "linear" ? angle : undefined,
                  id: favourites[favourites.length - 1]?.id + 1 || 0,
                },
              ];
              setFavourites(newFavourites);
              localStorage.setItem(
                "favouritesGradients",
                JSON.stringify(newFavourites)
              );
              toast({
                title: "Success",
                description: "The gradient has been saved to your favourites",
              });
            }}
          >
            <span className="hidden md:block">Save</span>
            <FaHeart className="block md:hidden lg:block" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Gradient