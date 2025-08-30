import { Badge } from '@/components/ui/badge';
import { CircleIcon } from 'lucide-react';

interface TypeBadgeProps {
  type: string | boolean;
  label: string;
}

const TypeBadge = ({ type, label }: TypeBadgeProps) => {
  if (type) {
    return (
      <Badge className="hover:bg-muted rounded-2xl bg-emerald-500/10 font-medium text-emerald-500">
        <CircleIcon className="mr-2 fill-emerald-500" size={10} />
        {label}
      </Badge>
    );
  }

  if (!type) {
    return (
      <Badge className="hover:bg-muted rounded-2xl bg-red-500/10 font-medium text-red-700">
        <CircleIcon className="mr-2 fill-red-500" size={10} />
        {label}
      </Badge>
    );
  }
};

export default TypeBadge;
