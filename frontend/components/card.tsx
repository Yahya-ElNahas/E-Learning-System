import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import '@/styles/globals.css'; 

interface Course {
  title: string;
  description: string;
}

interface CardComponentProps {
  course: Course;
}

export default function CardComponent({ course }: CardComponentProps) {
  return (
    <div className="flex justify-center items-center h-screen">  
      <Card className="w-[500px] h-[200px]"> 
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-bold">{course.title}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{course.description}</p>
        </CardBody>
        <Divider />
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
}
