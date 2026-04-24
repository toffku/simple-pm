import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Calendar } from "./ui/calendar";
import { DatePickerDemo } from "./DatePicker";

const AddProjectCard = ({ onClose }: { onClose: () => void }) => {
    return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              onClick={onClose}
            >
              <Card
                className="w-full max-w-md mx-4 p-6 flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h1 className="text-xl font-semibold">Add a new project</h1>
                <Input type="text" placeholder="Project name" />
                <Input type="text" placeholder="Project description" />
                <Label className="text-sm font-medium">Project start date</Label>
                <DatePickerDemo />
                <Label className="text-sm font-medium">Project end date</Label>
                <DatePickerDemo />
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" type="button" onClick={onClose} className="cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" className="cursor-pointer">Add project</Button>
                </div>
              </Card>
            </div>
    )
}

export default AddProjectCard;