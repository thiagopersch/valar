export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  iconSvg?: string;
  path?: string;
  children?: MenuItem[];
  parentPath?: string;
}
