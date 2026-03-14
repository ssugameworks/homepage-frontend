export type HeaderConfig = {
  activeSection: string;
  pageTitle?: string;
  darkHero?: boolean;
};

export type PageProps = {
  onHeaderConfig: (config: HeaderConfig) => void;
  onHeroReady: () => void;
};
