import { Badge } from '@/components/ui/badge';
import { CircleIcon } from 'lucide-react';

const TypeBadge = ({ type }: { type: string | boolean }) => {
  if (type) {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-muted font-bold rounded-2xl">
        <CircleIcon className="mr-2 fill-emerald-500" size={10} />
        Ativo
      </Badge>
    );
  }

  if (!type) {
    return (
      <Badge className="bg-red-700/10 text-danger font-bold rounded-2xl">
        <CircleIcon className="mr-2 text-red-500" size={10} />
        Inativo
      </Badge>
    );
  }
};

export default TypeBadge;
