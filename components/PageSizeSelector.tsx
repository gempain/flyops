import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageSizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  options?: number[];
  id?: string;
  className?: string;
}

export function PageSizeSelector({
  value,
  onChange,
  label = "Page size:",
  options = [10, 25, 50, 100],
  id = "page-size",
  className = "",
}: PageSizeSelectorProps) {
  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <Label htmlFor={id} className="whitespace-nowrap">
        {label}
      </Label>
      <Select value={value.toString()} onValueChange={(val) => onChange(parseInt(val))}>
        <SelectTrigger id={id} className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
