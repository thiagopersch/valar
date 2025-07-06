import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Maria Silva</p>
          <p className="text-sm text-muted-foreground">maria.silva@email.com</p>
        </div>
        <div className="ml-auto font-medium">+R$1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">João Santos</p>
          <p className="text-sm text-muted-foreground">joao.santos@email.com</p>
        </div>
        <div className="ml-auto font-medium">+R$39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ana Costa</p>
          <p className="text-sm text-muted-foreground">ana.costa@email.com</p>
        </div>
        <div className="ml-auto font-medium">+R$299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>PO</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Pedro Oliveira</p>
          <p className="text-sm text-muted-foreground">
            pedro.oliveira@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+R$99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>LM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Lucia Martins</p>
          <p className="text-sm text-muted-foreground">
            lucia.martins@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+R$39.00</div>
      </div>
    </div>
  );
}
