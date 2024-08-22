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

interface Color {
  color: string;
  stop: number;
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
    return `linear-gradient(${angle}deg, ${colors
      .map((color) => `${color.color} ${color.stop}%`)
      .join(", ")})`;
  };

  const radialGradient = () => {
    return `radial-gradient(circle, ${colors
      .map((color) => `${color.color} ${color.stop}%`)
      .join(", ")})`;
  };

  const getNewStop = () => {
    if (colors.length === 1) return colors[0].stop === 1000 ? 0 : 100;

    return (
      (colors[colors.length - 1].stop + colors[colors.length - 2].stop) / 2
    );
  };

  return (
    <div className="flex p-12 gap-x-8">
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
          <div className="flex justify-between items-center">
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
      </div>
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Gradient generator</CardTitle>
          <CardDescription>
            Pick your colors to generate your gradient colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={type}
            className="w-[400px]"
            onValueChange={setType}
          >
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
        <CardFooter className="flex gap-x-2">
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
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Gradient