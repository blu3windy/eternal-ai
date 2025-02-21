import ROUTERS from "../../../constants/route-path.ts";

export interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  isNewWindow?: boolean;
  rootHref?: string;
  href?: string;
  isHide?: boolean;
  isTwitter?: boolean;
  subMenu?: {
    label: string;
    href: string;
    isNewWindow: boolean;
    isHide: boolean;
  }[];
  icon?: any;
  isLogoWebsite?: boolean;
  isBtnLogin?: boolean;
  isOnlyIcon?: boolean;
  isDropdown?: boolean;
  dropDownComp?: JSX.Element;
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Products',
    href: '',
    isNewWindow: false,
    isHide: false,
    isDropdown: true,
  },
  {
    label: `Research`,
    href: ROUTERS.RESEARCH,
    isNewWindow: false,
    isHide: false,
  },
  {
    label: `Agents`,
    href: ROUTERS.AGENTS_TOKEN,
    isNewWindow: false,
    isHide: false,
  },
  {
    label: 'Open Source',
    href: 'https://github.com/eternalai-org/truly-open-ai',
    isNewWindow: true,
    isHide: false,
  },
  {
    label: 'Get EAI',
    href: ROUTERS.AI_EAI,
    isNewWindow: false,
    isHide: false,
  },
].filter((item) => !item.isHide);