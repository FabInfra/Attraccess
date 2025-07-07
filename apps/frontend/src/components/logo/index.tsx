import { cn, Image, Link, LinkProps } from '@heroui/react';

export function Logo(props: Omit<LinkProps, 'children'>) {
  return (
    <Link
      color={props.color ?? 'foreground'}
      href={props.href ?? '/'}
      className={cn(props.className, 'font-bold text-inherit flex items-center gap-2')}
    >
      <Image src="/logo.png" alt="FabAccess" height={32} />
      <span className="text-xl">FabAccess</span>
    </Link>
  );
}
